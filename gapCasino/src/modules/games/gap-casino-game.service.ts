import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan, Like } from 'typeorm';
import { GapCasino } from './entities/gap-casino.entity';
import { GapCasinoTransaction, TransactionStatus } from './entities/gap-casino-transaction.entity';
import { GapCasinoUserToken } from './entities/gap-casino-user-token.entity';
import { User } from '../users/entities/user.entity';
import { SignatureService } from '../../common/utils/signature.service';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class GapCasinoGameService {
  private gamesCache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(
    @InjectRepository(GapCasino)
    private gapCasinoRepository: Repository<GapCasino>,
    @InjectRepository(GapCasinoTransaction)
    private gapCasinoTransactionRepository: Repository<GapCasinoTransaction>,
    @InjectRepository(GapCasinoUserToken)
    private gapCasinoUserTokenRepository: Repository<GapCasinoUserToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private signatureService: SignatureService,
  ) {}

  async getGamesFromDB(requestParams: any): Promise<any> {
    const { category, page } = requestParams;
    const limit = category == 'evolution' && page === undefined ? 100 : 50;
    const skip = ((page ? page : 1) - 1) * limit;

    const filtercategory =
      category === 'evolution'
        ? 'dc'
        : category === 'royalgames'
        ? 'rg'
        : category === 'supernowa'
        ? 'suno'
        : category;

    const combinedData = await this.gapCasinoRepository
      .find({
        where: {
          urlThumb: MoreThan('no_thumb'),
          status: true,
          providerName: filtercategory.toLowerCase(),
        },
        order: {
          updatedAt: 'DESC',
        },
        skip,
        take: limit,
      });

    return combinedData;
  }

  async getTabsFromDB(): Promise<any> {
    const games = await this.gapCasinoRepository.find({
      where: {
        status: true,
        urlThumb: MoreThan('no_thumb'),
      },
    });

    const gameObj = {};

    games.forEach((game) => {
      const provider = game.providerName.toLowerCase();
      const key =
        provider === 'dc'
          ? 'evolution'
          : provider === 'rg'
          ? 'royalgames'
          : provider === 'suno'
          ? 'supernowa'
          : provider;

      if (!gameObj[key]) {
        gameObj[key] = [];
      }
      gameObj[key].push(game);
    });

    const prioritizedProviders = ['supernowa', 'evolution', 'ezugi', 'royalgames'];

    const filteredKeys = Object.keys(gameObj)
      .filter((key) => !prioritizedProviders.includes(key))
      .sort()
      .reverse();

    const result = [
      ...filteredKeys,
      ...prioritizedProviders.filter((provider) => gameObj[provider]),
    ];

    return result.reverse();
  }

  async getGames(): Promise<any> {
    try {
      // Resolve the path to the JSON file
      const filePath = path.resolve(__dirname, '../../../../GameList_Jul_20.json');

      // Read and parse the JSON file
      const data = await fs.promises.readFile(filePath, 'utf-8');
      const parsedData = JSON.parse(data);

      if (!Array.isArray(parsedData.Data)) {
        throw new Error("Expected 'Data' to be an array.");
      }

      await this.gapCasinoRepository.clear();

      // Process each game in the JSON data
      for (const element of parsedData.Data) {
        const checkGame = await this.gapCasinoRepository.findOne({
          where: {
            name: element['Game Name'],
            gameCode: element['Game Code'],
          },
        });

        if (!checkGame) {
          const gapCasinoObj = {
            gameId: element['Game Id'],
            name: element['Game Name'],
            gameCode: element['Game Code'],
            category: element.Category,
            providerName: element['Provider Name'],
            subProviderName: element['Sub Provider Name'],
            status: element.Status === 'ACTIVE' ? true : false,
            urlThumb: element['Url Thumb'],
          };

          const newGame = this.gapCasinoRepository.create(gapCasinoObj);
          await this.gapCasinoRepository.save(newGame);

          // Generate token for the new game
          const token = this.generateToken(newGame.id);
          if (token) {
            newGame.token = token;
            await this.gapCasinoRepository.save(newGame);
          }
        }
      }

      return parsedData.Data;
    } catch (error) {
      throw new Error(`Failed to get games: ${error.message}`);
    }
  }

  async getGameUrl(requestParams: any, authUserId: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: authUserId },
      });

      const apiUrl = `${process.env.GAP_CASINO_BASE_URL}/login`;

      const requestData = {
        operatorId: process.env.GAP_OPERATOR_ID,
        userId: user?.username,
        providerName: requestParams.providerName,
        platformId: 'desktop',
        currency: 'USD', // Default currency, you might want to get this from user
        clientIp: '1.1.1.1',
        username: user?.username,
        balance: user?.balance,
        lobby: true,
        gameId: requestParams.gameId,
      };

      const dataStringify = JSON.stringify(requestData);
      const encodedSignature = await this.signatureService.createSignature(dataStringify);

      const headers = {
        Signature: encodedSignature,
        'Content-Type': 'application/json',
      };

      const response = await axios.post(apiUrl, requestData, { headers });

      const yesterdayStart = new Date();
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      yesterdayStart.setHours(0, 0, 0, 0);

      const yesterdayEnd = new Date();
      yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
      yesterdayEnd.setHours(23, 59, 59, 999);

      await this.gapCasinoUserTokenRepository.delete({
        userId: user?.id,
        createdAt: Between(yesterdayStart, yesterdayEnd),
      });

      const userToken = this.gapCasinoUserTokenRepository.create({
        userId: user?.id,
        gap_casino_token: response?.data?.token,
      });
      await this.gapCasinoUserTokenRepository.save(userToken);

      return response.data;
    } catch (error) {
      if (error?.code === 'ERR_BAD_REQUEST') {
        throw new Error('Game not found');
      }
      throw new Error(`Failed to get game URL: ${error.message}`);
    }
  }

  async getBalance(requestParams: any, encodedSignature: string): Promise<any> {
    try {
      const requestParamsJsonStringify = JSON.stringify(requestParams);
      const signatureValid = await this.signatureService.verifySignature(
        encodedSignature,
        requestParamsJsonStringify,
      );

      if (signatureValid) {
        const user = await this.userRepository.findOne({
          where: { username: requestParams?.userId },
        });

        if (!user) {
          return { status: 'OP_USER_NOT_FOUND' };
        }

        if (!user.betAllow || user.status !== '1') {
          return { status: 'OP_USER_DISABLED' };
        }

        const gapCasinoToken = await this.gapCasinoUserTokenRepository.findOne({
          where: {
            userId: user?.id,
            gap_casino_token: requestParams?.token,
          },
        });

        if (!gapCasinoToken || gapCasinoToken.gap_casino_token !== requestParams?.token) {
          return { status: 'OP_TOKEN_NOT_FOUND' };
        }

        let balance = user?.balance || 0;

        // Assuming PKR handling, you might want to adjust this based on your actual currency logic
        if (user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR') {
          balance = balance / 1000; // Assuming GAP_CASINO.PKR value
        }

        const data = {
          balance: parseFloat(balance.toFixed(2)),
          status: 'OP_SUCCESS',
        };

        return data;
      } else {
        return { status: 'OP_INVALID_SIGNATURE' };
      }
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  async placeBet(requestParams: any, encodedSignature: string): Promise<any> {
    try {
      const requestParamsJsonStringify = JSON.stringify(requestParams);
      const signatureValid = await this.signatureService.verifySignature(
        encodedSignature,
        requestParamsJsonStringify,
      );

      if (signatureValid) {
        let debitAmount = requestParams.debitAmount;
        let data: any;
        const user = await this.userRepository.findOne({
          where: { username: requestParams.userId },
        });

        // Assuming PKR handling, you might want to adjust this based on your actual currency logic
        if (user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR') {
          debitAmount = (parseFloat(debitAmount) * 1000).toString(); // Assuming GAP_CASINO.PKR value
        }

        if (requestParams.gameId === '') {
          data = { status: 'OP_INVALID_PARAMS' };
        } else {
          if (user !== null) {
            if (user && user.betAllow && user.status == '1') {
              if (parseFloat(debitAmount) < 0) {
                data = { status: 'OP_ERROR_NEGATIVE_DEBIT_AMOUNT' };
              } else {
                const gapCasinoToken = await this.gapCasinoUserTokenRepository.findOne({
                  where: {
                    userId: user?.id,
                    gap_casino_token: requestParams?.token,
                  },
                });

                if (!gapCasinoToken || gapCasinoToken.gap_casino_token !== requestParams.token) {
                  data = { status: 'OP_TOKEN_EXPIRED' };
                } else {
                  let balance = user.balance;
                  const game = await this.gapCasinoRepository.findOne({
                    where: {
                      gameId: requestParams.gameId,
                    },
                  });

                  if (balance <= 0) {
                    data = { status: 'OP_INSUFFICIENT_FUNDS' };
                  } else {
                    if (game === null) {
                      data = { status: 'OP_INVALID_GAME' };
                    } else {
                      const checkStatement = await this.gapCasinoTransactionRepository.find({
                        where: {
                          userId: user.id,
                          txnId: requestParams.transactionId,
                        },
                      });

                      const txnId = checkStatement?.map((txn) => txn?.txnId);

                      if (!txnId?.includes(requestParams.transactionId)) {
                        if (parseFloat(debitAmount) > parseFloat(balance.toFixed(2))) {
                          data = { status: 'OP_INSUFFICIENT_FUNDS' };
                        } else {
                          balance = balance - parseFloat(debitAmount);

                          // CREATE BET
                          let description =
                            requestParams.betType +
                            '_' +
                            new Date().toLocaleDateString().replace('/', '-');
                          let modifiedDescription = description + '_' + game.gameCode;

                          const transaction = this.gapCasinoTransactionRepository.create({
                            userId: user.id,
                            gameId: requestParams.gameId,
                            roundId: requestParams.roundId,
                            txnId: requestParams.transactionId,
                            reqId: requestParams.reqId,
                            stake: parseFloat(debitAmount),
                            pl: 0,
                            prevBalance: user.balance,
                            currency: {
                              code: user?.currencyId,
                              value: 1, // Default value, adjust as needed
                            },
                            status: TransactionStatus.OPEN,
                            description: modifiedDescription,
                          });
                          await this.gapCasinoTransactionRepository.save(transaction);

                          let updatedBalance = user?.balance;
                          updatedBalance -= parseFloat(debitAmount);
                          await this.userRepository.update(user.id, {
                            balance: updatedBalance,
                          });

                          // Assuming PKR handling, you might want to adjust this based on your actual currency logic
                          if (user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR') {
                            balance = balance / 1000; // Assuming GAP_CASINO.PKR value
                          }

                          data = {
                            balance: parseFloat(balance.toFixed(2)),
                            status: 'OP_SUCCESS',
                          };
                        }
                      } else {
                        data = { status: 'OP_DUPLICATE_TRANSACTION' };
                      }
                    }
                  }
                }
              }
            } else {
              data = { status: 'OP_USER_DISABLED' };
            }
          } else {
            data = { status: 'OP_USER_NOT_FOUND' };
          }
        }

        return data;
      } else {
        return { status: 'OP_INVALID_SIGNATURE' };
      }
    } catch (error) {
      throw new Error(`Failed to place bet: ${error.message}`);
    }
  }

  async processResult(requestParams: any, encodedSignature: string): Promise<any> {
    try {
      const requestParamsJsonStringify = JSON.stringify(requestParams);
      const signatureValid = await this.signatureService.verifySignature(
        encodedSignature,
        requestParamsJsonStringify,
      );

      let creditAmount = requestParams.creditAmount;
      let data: any = '';

      if (signatureValid) {
        const user = await this.userRepository.findOne({
          where: { username: requestParams.userId },
        });

        // Assuming PKR handling, you might want to adjust this based on your actual currency logic
        if (user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR' && parseFloat(creditAmount) !== 0) {
          creditAmount = (parseFloat(creditAmount) * 1000).toString(); // Assuming GAP_CASINO.PKR value
        }

        if (requestParams.gameId === '') {
          data = { status: 'OP_INVALID_PARAMS' };
        } else {
          if (user !== null) {
            if (user && user.betAllow && user.status == '1') {
              const gapCasinoToken = await this.gapCasinoUserTokenRepository.findOne({
                where: {
                  userId: user?.id,
                  gap_casino_token: requestParams?.token,
                },
              });

              if (!gapCasinoToken || gapCasinoToken.gap_casino_token !== requestParams.token) {
                data = { status: 'OP_TOKEN_EXPIRED' };
              } else {
                const game = await this.gapCasinoRepository.findOne({
                  where: {
                    gameId: requestParams.gameId,
                  },
                });

                if (game === null) {
                  data = { status: 'OP_INVALID_GAME' };
                } else {
                  const checkStatement = await this.gapCasinoTransactionRepository.findOne({
                    where: {
                      userId: user.id,
                      roundId: requestParams.roundId,
                      txnId: requestParams.transactionId,
                    },
                  });

                  const checkDuplicateReqId = await this.gapCasinoTransactionRepository.findOne({
                    where: {
                      reqId: requestParams.reqId,
                    },
                  });

                  let balance = user?.balance || 0;

                  if (checkStatement && checkStatement.status !== TransactionStatus.SETTLED) {
                    if (checkStatement === null) {
                      data = { status: 'OP_TRANSACTION_NOT_FOUND' };
                    } else {
                      if (checkDuplicateReqId) {
                        data = { status: 'OP_DUPLICATE_TRANSACTION' };
                      } else {
                        if (checkStatement?.status === TransactionStatus.ROLLBACK) {
                          data = { status: 'OP_ERROR_TRANSACTION_INVALID' };
                        } else {
                          balance += parseFloat(creditAmount);

                          let totalPl = 0;
                          totalPl = checkStatement?.pl + parseFloat(creditAmount);

                          await this.gapCasinoTransactionRepository.update(checkStatement.id, {
                            pl:
                              parseFloat(creditAmount) === 0
                                ? user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR'
                                  ? -parseFloat(checkStatement?.stake.toString()) * 1000
                                  : -parseFloat(checkStatement?.stake.toString())
                                : parseFloat(totalPl.toString()),
                            status: TransactionStatus.SETTLED,
                            txnId: requestParams.transactionId,
                            postBalance: user?.balance,
                          });

                          // CREATE OR UPDATE STATEMENT BY DESCRIPTION
                          let description =
                            requestParams.betType +
                            '_' +
                            new Date().toLocaleDateString().replace('/', '-');
                          let modifiedDescription = description + '_' + game.gameCode;

                          let checkRTxn = await this.gapCasinoTransactionRepository.findOne({
                            where: {
                              userId: user.id,
                              description: modifiedDescription,
                            },
                          });

                          if (checkRTxn != null) {
                            let finalPl = 0;

                            if (parseFloat(creditAmount) < parseFloat(checkStatement?.stake.toString())) {
                              if (parseFloat(creditAmount) < 0) {
                                finalPl = -parseFloat(checkStatement?.stake.toString());
                              } else {
                                finalPl = parseFloat(creditAmount);
                              }
                            } else {
                              finalPl =
                                parseFloat(creditAmount) - parseFloat(checkStatement?.stake.toString());
                            }

                            await this.gapCasinoTransactionRepository.update(checkRTxn.id, {
                              pl: checkRTxn.pl + finalPl,
                            });
                          }

                          let updatedBalance = user?.balance;
                          updatedBalance += parseFloat(creditAmount);

                          await this.userRepository.update(user.id, {
                            balance: updatedBalance,
                          });

                          const userBalance = await this.userRepository.findOne({
                            where: { id: user?.id },
                            select: ['balance'],
                          });

                          await this.gapCasinoTransactionRepository.update(checkStatement.id, {
                            postBalance: userBalance?.balance,
                          });

                          // Assuming PKR handling, you might want to adjust this based on your actual currency logic
                          if (user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR') {
                            balance = balance / 1000; // Assuming GAP_CASINO.PKR value
                          }

                          data = {
                            balance: parseFloat(balance.toFixed(2)),
                            status: 'OP_SUCCESS',
                          };
                        }
                      }
                    }
                  } else {
                    data = { status: 'OP_ERROR_TRANSACTION_INVALID' };
                  }
                }
              }
            } else {
              data = { status: 'OP_USER_DISABLED' };
            }
          } else {
            data = { status: 'OP_USER_NOT_FOUND' };
          }
        }
      } else {
        data = { status: 'OP_INVALID_SIGNATURE' };
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to process result: ${error.message}`);
    }
  }

  async processRollback(requestParams: any, encodedSignature: string): Promise<any> {
    try {
      const requestParamsJsonStringify = JSON.stringify(requestParams);
      const signatureValid = await this.signatureService.verifySignature(
        encodedSignature,
        requestParamsJsonStringify,
      );

      let amount = requestParams.rollbackAmount;
      let data: any = '';
      let balance = 0;

      if (signatureValid) {
        const user = await this.userRepository.findOne({
          where: { username: requestParams.userId },
        });

        // Assuming PKR handling, you might want to adjust this based on your actual currency logic
        if (user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR' && parseFloat(amount) !== 0) {
          amount = (parseFloat(amount) * 1000).toString(); // Assuming GAP_CASINO.PKR value
        }

        if (requestParams.gameId === '') {
          data = { status: 'OP_INVALID_PARAMS' };
        } else {
          if (user) {
            const gapCasinoToken = await this.gapCasinoUserTokenRepository.findOne({
              where: {
                userId: user?.id,
                gap_casino_token: requestParams?.token,
              },
            });

            if (gapCasinoToken && gapCasinoToken.gap_casino_token === requestParams.token) {
              if (user && user.betAllow && user.status == '1') {
                balance = user.balance;

                const checkStatement = await this.gapCasinoTransactionRepository.findOne({
                  where: {
                    userId: user.id,
                    txnId: requestParams.transactionId,
                  },
                  select: ['reqId'],
                });

                if (checkStatement?.reqId === requestParams.reqId) {
                  data = { status: 'OP_DUPLICATE_TRANSACTION' };
                } else {
                  if (checkStatement) {
                    await this.gapCasinoTransactionRepository.update(
                      { userId: user?.id },
                      {
                        roundId: requestParams.roundId,
                        txnId: requestParams.transactionId,
                        reqId: requestParams.reqId,
                        status: TransactionStatus.ROLLBACK,
                      },
                    );

                    await this.gapCasinoTransactionRepository.delete({
                      userId: user.id,
                      txnId: requestParams.transactionId,
                      roundId: requestParams.roundId,
                      // Note: type field doesn't exist in GapCasinoTransaction entity
                    });

                    balance += parseFloat(amount);

                    let updatedBalance = user?.balance;
                    updatedBalance += parseFloat(amount);
                    await this.userRepository.update(user.id, {
                      balance: updatedBalance,
                    });

                    // Assuming PKR handling, you might want to adjust this based on your actual currency logic
                    if (user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR') {
                      balance = balance / 1000; // Assuming GAP_CASINO.PKR value
                    }

                    data = {
                      balance: parseFloat(balance.toFixed(2)),
                      status: 'OP_SUCCESS',
                    };
                  } else {
                    data = { status: 'OP_TRANSACTION_NOT_FOUND' };
                  }
                }
              } else {
                data = { status: 'OP_USER_DISABLED' };
              }
            } else {
              data = { status: 'OP_INVALID_TOKEN' };
            }
          } else {
            data = { status: 'OP_USER_NOT_FOUND' };
          }
        }
      } else {
        data = { status: 'OP_INVALID_SIGNATURE' };
      }

      return data;
    } catch (error) {
      throw new Error(`Failed to process rollback: ${error.message}`);
    }
  }

  async updateTokens(): Promise<void> {
    try {
      const existingDocuments = await this.gapCasinoRepository.find();
      for (const doc of existingDocuments) {
        if (!doc.token) {
          doc.token = this.generateToken(doc.id);
          await this.gapCasinoRepository.save(doc);
        }
      }
    } catch (error) {
      throw new Error(`Failed to update tokens: ${error.message}`);
    }
  }

  private generateToken(id: string): string {
    // Simple token generation - you might want to use a more secure method
    return `${id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all games grouped by provider with caching
   * This method returns complete data but with efficient caching to reduce database load
   */
  async getAllGamesGroupedByProviderWithCache(): Promise<any> {
    const cacheKey = 'all_games_grouped_by_provider';
    const now = Date.now();
    
    // Check if we have valid cached data
    if (this.gamesCache.has(cacheKey) && 
        this.cacheExpiry.has(cacheKey) && 
        this.cacheExpiry.get(cacheKey)! > now) {
      return this.gamesCache.get(cacheKey);
    }
    
    // Cache miss or expired, fetch from database
    const result = await this.getGamesGroupedByProvider();
    
    // Store in cache
    this.gamesCache.set(cacheKey, result);
    this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
    
    return result;
  }

  /**
   * Get provider metadata for efficient frontend loading
   * Returns just the provider names and game counts without full game data
   */
  async getProviderMetadata(): Promise<any> {
    try {
      // Get all active games grouped by provider with counts
      const games = await this.gapCasinoRepository.find({
        where: {
          status: true
        },
        select: ['providerName']
      });

      // Count games per provider
      const providerCounts: { [key: string]: number } = {};
      
      games.forEach((game) => {
        const provider = game.providerName || 'Unknown';
        providerCounts[provider] = (providerCounts[provider] || 0) + 1;
      });

      // Convert to array format
      const result = Object.entries(providerCounts).map(([providerName, count]) => ({
        providerName,
        gameCount: count
      }));

      // Sort by game count descending
      result.sort((a, b) => b.gameCount - a.gameCount);

      return result;
    } catch (error) {
      throw new Error(`Failed to get provider metadata: ${error.message}`);
    }
  }

  /**
   * Get games for a specific provider with optional pagination
   * This allows frontend to load provider data on-demand
   */
  async getGamesByProvider(providerName: string, offset: number = 0, limit: number = 50): Promise<any> {
    try {
      // Get games for specific provider
      const games = await this.gapCasinoRepository.find({
        where: {
          status: true,
          providerName: providerName
        },
        order: {
          name: 'ASC'
        },
        skip: offset,
        take: limit
      });

      // Get total count for this provider
      const totalCount = await this.gapCasinoRepository.count({
        where: {
          status: true,
          providerName: providerName
        }
      });

      return {
        providerName,
        games,
        pagination: {
          offset,
          limit,
          total: totalCount,
          hasMore: offset + limit < totalCount
        }
      };
    } catch (error) {
      throw new Error(`Failed to get games for provider ${providerName}: ${error.message}`);
    }
  }

  /**
   * Get all games grouped by provider with comprehensive optimizations
   * This method returns complete data for all providers with multiple optimization strategies
   */
  async getAllGamesGroupedByProviderOptimized(options?: {
    useCache?: boolean;
    compressData?: boolean;
    selectFields?: string[];
  }): Promise<any> {
    const useCache = options?.useCache ?? true;
    const compressData = options?.compressData ?? false;
    const selectFields = options?.selectFields || [
      'id', 'gameId', 'name', 'gameCode', 'category', 
      'providerName', 'subProviderName', 'urlThumb', 'status'
    ];

    const cacheKey = `all_games_optimized_${selectFields.join(',')}_${compressData}`;
    const now = Date.now();
    
    // Check if we have valid cached data
    if (useCache && this.gamesCache.has(cacheKey) && 
        this.cacheExpiry.has(cacheKey) && 
        this.cacheExpiry.get(cacheKey)! > now) {
      return this.gamesCache.get(cacheKey);
    }
    
    try {
      // Optimize database query with selected fields only
      const queryBuilder = this.gapCasinoRepository.createQueryBuilder('game')
        .where('game.status = :status', { status: true })
        .orderBy('game.providerName', 'ASC')
        .addOrderBy('game.name', 'ASC');
      
      // Select only required fields to reduce data transfer
      if (selectFields && selectFields.length > 0) {
        queryBuilder.select(selectFields.map(field => `game.${field}`));
      }
      
      const games = await queryBuilder.getMany();

      // Group games by provider
      const groupedGames: { [key: string]: any } = {};
      
      // Define priority order for providers
      const priorityProviders = ['SUNO', 'DC', 'EZUGI', 'RG'];
      
      games.forEach((game) => {
        const provider = game.providerName || 'Unknown';
        
        if (!groupedGames[provider]) {
          groupedGames[provider] = {
            providerName: provider,
            games: []
          };
        }
        
        // Only include fields that were selected
        const gameData: any = {};
        selectFields.forEach(field => {
          if (game.hasOwnProperty(field)) {
            gameData[field] = (game as any)[field];
          }
        });
        
        groupedGames[provider].games.push(gameData);
      });

      // Convert to array and sort by priority
      const result = Object.values(groupedGames).sort((a: any, b: any) => {
        const aIndex = priorityProviders.indexOf(a.providerName);
        const bIndex = priorityProviders.indexOf(b.providerName);
        
        // If both are in priority list, sort by their order in the list
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        // If only a is in priority list, it comes first
        if (aIndex !== -1) {
          return -1;
        }
        
        // If only b is in priority list, it comes first
        if (bIndex !== -1) {
          return 1;
        }
        
        // If neither is in priority list, sort alphabetically
        return a.providerName.localeCompare(b.providerName);
      });

      // Compress data if requested
      let finalResult = result;
      if (compressData) {
        // Remove redundant providerName from each game object since it's already at the group level
        finalResult = result.map(providerGroup => {
          const gamesWithoutProviderName = providerGroup.games.map((game: any) => {
            const { providerName, ...gameWithoutProvider } = game;
            return gameWithoutProvider;
          });
          
          return {
            ...providerGroup,
            games: gamesWithoutProviderName
          };
        });
      }

      // Store in cache if caching is enabled
      if (useCache) {
        this.gamesCache.set(cacheKey, finalResult);
        this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
      }
      
      return finalResult;
    } catch (error) {
      throw new Error(`Failed to get optimized grouped games: ${error.message}`);
    }
  }

  /**
   * Get pre-aggregated game statistics to reduce frontend processing
   */
  async getGameStatistics(): Promise<any> {
    try {
      // Get total game count and provider statistics in a single query
      const stats = await this.gapCasinoRepository
        .createQueryBuilder('game')
        .select('game.providerName', 'providerName')
        .addSelect('COUNT(*)', 'gameCount')
        .addSelect('MIN(game.createdAt)', 'firstAdded')
        .addSelect('MAX(game.updatedAt)', 'lastUpdated')
        .where('game.status = :status', { status: true })
        .groupBy('game.providerName')
        .orderBy('gameCount', 'DESC')
        .getRawMany();

      // Get total games count
      const totalGames = await this.gapCasinoRepository.count({
        where: { status: true }
      });

      return {
        totalGames,
        providers: stats,
        generatedAt: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to get game statistics: ${error.message}`);
    }
  }

  /**
   * Clear the games cache
   */
  clearGamesCache(): void {
    this.gamesCache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * Get games grouped by provider in batches
   * @param batchNumber - The batch number (0 for first batch, 1 for second, etc.)
   * @param batchSize - Number of games per batch (default 100)
   * @returns Games grouped by provider for the specified batch
   */
  async getGamesGroupedByProviderBatch(batchNumber: number = 0, batchSize: number = 100): Promise<any> {
    try {
      // Calculate offset based on batch number and size
      const offset = batchNumber * batchSize;
      
      // Get all active games ordered by provider and name
      const allGames = await this.gapCasinoRepository.find({
        where: {
          status: true
        },
        order: {
          providerName: 'ASC',
          name: 'ASC',
        },
        skip: offset,
        take: batchSize,
      });

      // Group games by provider
      const groupedGames: { [key: string]: any } = {};
      
      // Define priority order for providers
      const priorityProviders = ['SUNO', 'DC', 'EZUGI', 'RG'];
      
      allGames.forEach((game) => {
        const provider = game.providerName || 'Unknown';
        
        if (!groupedGames[provider]) {
          groupedGames[provider] = {
            providerName: provider,
            games: []
          };
        }
        
        groupedGames[provider].games.push({
          id: game.id,
          gameId: game.gameId,
          name: game.name,
          gameCode: game.gameCode,
          category: game.category,
          providerName: game.providerName,
          subProviderName: game.subProviderName,
          urlThumb: game.urlThumb,
          status: game.status,
          token: game.token,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt
        });
      });

      // Convert to array and sort by priority
      const result = Object.values(groupedGames).sort((a: any, b: any) => {
        const aIndex = priorityProviders.indexOf(a.providerName);
        const bIndex = priorityProviders.indexOf(b.providerName);
        
        // If both are in priority list, sort by their order in the list
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        // If only a is in priority list, it comes first
        if (aIndex !== -1) {
          return -1;
        }
        
        // If only b is in priority list, it comes first
        if (bIndex !== -1) {
          return 1;
        }
        
        // If neither is in priority list, sort alphabetically
        return a.providerName.localeCompare(b.providerName);
      });

      // Check if there are more games available
      const totalGames = await this.gapCasinoRepository.count({
        where: { status: true }
      });
      
      const hasMore = offset + batchSize < totalGames;

      return {
        data: result,
        pagination: {
          batchNumber,
          batchSize,
          offset,
          total: totalGames,
          hasMore
        }
      };
    } catch (error) {
      throw new Error(`Failed to get batched grouped games: ${error.message}`);
    }
  }

  /**
   * Get games grouped by provider in continuous batches
   * Each batch will contain up to batchSize games, combining providers as needed to fill the batch
   * @param batchNumber - The batch number (0 for first batch, 1 for second, etc.)
   * @param batchSize - Number of games per batch (default 200)
   * @returns Games grouped by provider for the specified batch
   */
  async getGamesGroupedByProviderContinuousBatch(batchNumber: number = 0, batchSize: number = 200): Promise<any> {
    try {
      // Get all active games ordered by provider and name
      const allGames = await this.gapCasinoRepository.find({
        where: {
          status: true
        },
        order: {
          providerName: 'ASC',
          name: 'ASC',
        },
      });

      // Group all games by provider first
      const allGroupedGames: { [key: string]: any } = {};
      const priorityProviders = ['SUNO', 'DC', 'EZUGI', 'RG'];
      
      allGames.forEach((game) => {
        const provider = game.providerName || 'Unknown';
        
        if (!allGroupedGames[provider]) {
          allGroupedGames[provider] = {
            providerName: provider,
            games: []
          };
        }
        
        allGroupedGames[provider].games.push({
          id: game.id,
          gameId: game.gameId,
          name: game.name,
          gameCode: game.gameCode,
          category: game.category,
          providerName: game.providerName,
          subProviderName: game.subProviderName,
          urlThumb: game.urlThumb,
          status: game.status,
          token: game.token,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt
        });
      });

      // Sort providers by priority and convert to array
      const sortedProviders: any[] = Object.values(allGroupedGames).sort((a: any, b: any) => {
        const aIndex = priorityProviders.indexOf(a.providerName);
        const bIndex = priorityProviders.indexOf(b.providerName);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        if (aIndex !== -1) {
          return -1;
        }
        
        if (bIndex !== -1) {
          return 1;
        }
        
        return a.providerName.localeCompare(b.providerName);
      });

      // Flatten all games into a single array with provider information
      const flattenedGames: any[] = [];
      sortedProviders.forEach(provider => {
        provider.games.forEach((game: any) => {
          flattenedGames.push({
            ...game,
            providerInfo: {
              providerName: provider.providerName
            }
          });
        });
      });

      // Calculate start and end indices for this batch
      const startIndex = batchNumber * batchSize;
      const endIndex = startIndex + batchSize;
      
      // If start index is beyond available games, return empty
      if (startIndex >= flattenedGames.length) {
        return {
          data: [],
          pagination: {
            batchNumber,
            batchSize,
            totalGames: flattenedGames.length,
            hasMore: false
          }
        };
      }

      // Get games for this batch
      const batchGames = flattenedGames.slice(startIndex, endIndex);
      
      // Group batch games by provider
      const batchGroupedGames: { [key: string]: any } = {};
      
      batchGames.forEach((game) => {
        const providerName = game.providerInfo.providerName;
        
        if (!batchGroupedGames[providerName]) {
          batchGroupedGames[providerName] = {
            providerName: providerName,
            games: []
          };
        }
        
        // Remove providerInfo before adding to games array
        const { providerInfo, ...gameWithoutProviderInfo } = game;
        batchGroupedGames[providerName].games.push(gameWithoutProviderInfo);
      });

      // Convert to array
      const result = Object.values(batchGroupedGames);

      // Check if there are more games available
      const hasMore = endIndex < flattenedGames.length;

      return {
        data: result,
        pagination: {
          batchNumber,
          batchSize,
          totalGames: flattenedGames.length,
          hasMore
        }
      };
    } catch (error) {
      throw new Error(`Failed to get continuous batched grouped games: ${error.message}`);
    }
  }

  /**
   * Get all provider names only (for sidebar)
   * @returns Array of provider names sorted by priority
   */
  async getProviderNamesOnly(): Promise<any> {
    try {
      // Get all active games grouped by provider
      const games = await this.gapCasinoRepository.find({
        where: {
          status: true
        },
        select: ['providerName']
      });

      // Get unique provider names
      const providerNamesSet = new Set<string>();
      games.forEach(game => {
        providerNamesSet.add(game.providerName || 'Unknown');
      });

      // Convert to array and sort by priority
      const priorityProviders = ['SUNO', 'DC', 'EZUGI', 'RG'];
      const providerNamesArray = Array.from(providerNamesSet);
      
      const sortedProviders = providerNamesArray.sort((a, b) => {
        const aIndex = priorityProviders.indexOf(a);
        const bIndex = priorityProviders.indexOf(b);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        if (aIndex !== -1) {
          return -1;
        }
        
        if (bIndex !== -1) {
          return 1;
        }
        
        return a.localeCompare(b);
      });

      return sortedProviders;
    } catch (error) {
      throw new Error(`Failed to get provider names: ${error.message}`);
    }
  }

  /**
   * Get games grouped by provider with filtering and search capabilities
   * Optimized single endpoint for all game loading scenarios
   * @param batchNumber - The batch number (0 for first batch, 1 for second, etc.)
   * @param batchSize - Number of games per batch (default 200)
   * @param providerName - Optional provider name to filter by (use "all" or "ALL" for all providers)
   * @param searchQuery - Optional search query to filter games by name
   * @returns Games grouped by provider for the specified batch with filters applied
   */
  async getGamesGroupedByProviderOptimized(
    batchNumber: number = 0, 
    batchSize: number = 200, 
    providerName: string = 'all', 
    searchQuery?: string
  ): Promise<any> {
    try {
      // Normalize providerName - treat null/undefined/empty/'all'/'ALL' as no provider filter
      const normalizedProviderName = providerName ? providerName.toLowerCase() : '';
      const shouldFilterByProvider = normalizedProviderName && normalizedProviderName !== 'all' && normalizedProviderName !== '';
      
      // Create query builder
      let queryBuilder = this.gapCasinoRepository.createQueryBuilder('game')
        .where('game.status = :status', { status: true });
      
      // Add provider filter if specified and not "all"
      if (shouldFilterByProvider) {
        queryBuilder = queryBuilder.andWhere('game.providerName = :providerName', { providerName: providerName });
      }
      
      // Add search filter if specified
      if (searchQuery) {
        queryBuilder = queryBuilder.andWhere('LOWER(game.name) LIKE LOWER(:searchQuery)', { 
          searchQuery: `%${searchQuery}%` 
        });
      }
      
      // Get total count for pagination info
      const totalCount = await queryBuilder.getCount();
      
      // Order and get games for this batch
      const batchGames = await queryBuilder
        .orderBy('game.providerName', 'ASC')
        .addOrderBy('game.name', 'ASC')
        .skip(batchNumber * batchSize)
        .take(batchSize)
        .getMany();

      // Group batch games by provider
      const batchGroupedGames: { [key: string]: any } = {};
      const priorityProviders = ['SUNO', 'DC', 'EZUGI', 'RG'];
      
      batchGames.forEach((game) => {
        const provider = game.providerName || 'Unknown';
        
        if (!batchGroupedGames[provider]) {
          batchGroupedGames[provider] = {
            providerName: provider,
            games: []
          };
        }
        
        batchGroupedGames[provider].games.push({
          id: game.id,
          gameId: game.gameId,
          name: game.name,
          gameCode: game.gameCode,
          category: game.category,
          providerName: game.providerName,
          subProviderName: game.subProviderName,
          urlThumb: game.urlThumb,
          status: game.status,
          token: game.token,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt
        });
      });

      // Sort providers by priority and convert to array
      const sortedProviders: any[] = Object.values(batchGroupedGames).sort((a: any, b: any) => {
        const aIndex = priorityProviders.indexOf(a.providerName);
        const bIndex = priorityProviders.indexOf(b.providerName);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        if (aIndex !== -1) {
          return -1;
        }
        
        if (bIndex !== -1) {
          return 1;
        }
        
        return a.providerName.localeCompare(b.providerName);
      });

      // Check if there are more games available
      const hasMore = (batchNumber + 1) * batchSize < totalCount;

      return {
        data: sortedProviders,
        pagination: {
          batchNumber,
          batchSize,
          totalGames: totalCount,
          hasMore,
          providerName: providerName,
          searchQuery: searchQuery || ''
        }
      };
    } catch (error) {
      throw new Error(`Failed to get optimized batched grouped games: ${error.message}`);
    }
  }

  async getGamesGroupedByProvider(limit?: number): Promise<any> {
    try {
      // Get all active games (removing the thumbnail condition that might be too restrictive)
      const queryBuilder = this.gapCasinoRepository.createQueryBuilder('game')
        .where('game.status = :status', { status: true })
        .orderBy('game.providerName', 'ASC')
        .addOrderBy('game.name', 'ASC');
      
      // Apply limit if specified
      if (limit) {
        queryBuilder.limit(limit);
      }
      
      const games = await queryBuilder.getMany();

      // Group games by provider
      const groupedGames: { [key: string]: any } = {};
      
      // Define priority order for providers
      const priorityProviders = ['SUNO', 'DC', 'EZUGI', 'RG'];
      
      games.forEach((game) => {
        const provider = game.providerName || 'Unknown';
        
        if (!groupedGames[provider]) {
          groupedGames[provider] = {
            providerName: provider,
            games: []
          };
        }
        
        groupedGames[provider].games.push({
          id: game.id,
          gameId: game.gameId,
          name: game.name,
          gameCode: game.gameCode,
          category: game.category,
          providerName: game.providerName,
          subProviderName: game.subProviderName,
          urlThumb: game.urlThumb,
          status: game.status,
          token: game.token,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt
        });
      });

      // Convert to array and sort by priority
      const result = Object.values(groupedGames).sort((a: any, b: any) => {
        const aIndex = priorityProviders.indexOf(a.providerName);
        const bIndex = priorityProviders.indexOf(b.providerName);
        
        // If both are in priority list, sort by their order in the list
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        // If only a is in priority list, it comes first
        if (aIndex !== -1) {
          return -1;
        }
        
        // If only b is in priority list, it comes first
        if (bIndex !== -1) {
          return 1;
        }
        
        // If neither is in priority list, sort alphabetically
        return a.providerName.localeCompare(b.providerName);
      });

      return result;
    } catch (error) {
      throw new Error(`Failed to get grouped games: ${error.message}`);
    }
  }

  /**
   * Get games grouped by provider with infinite scroll support at the game level
   * @param offset - Number of games to skip per provider
   * @param limit - Number of games to return per provider (default 10)
   * @returns Games grouped by provider with pagination info
   */
  async getGamesGroupedByProviderPaginated(offset: number = 0, limit: number = 10): Promise<any> {
    try {
      // Get all active games ordered by provider and name
      const allGames = await this.gapCasinoRepository.find({
        where: {
          status: true
        },
        order: {
          providerName: 'ASC',
          name: 'ASC',
        },
      });

      // Group all games by provider first
      const allGroupedGames: { [key: string]: any } = {};
      const priorityProviders = ['SUNO', 'DC', 'EZUGI', 'RG'];
      
      allGames.forEach((game) => {
        const provider = game.providerName || 'Unknown';
        
        if (!allGroupedGames[provider]) {
          allGroupedGames[provider] = {
            providerName: provider,
            games: []
          };
        }
        
        allGroupedGames[provider].games.push({
          id: game.id,
          gameId: game.gameId,
          name: game.name,
          gameCode: game.gameCode,
          category: game.category,
          providerName: game.providerName,
          subProviderName: game.subProviderName,
          urlThumb: game.urlThumb,
          status: game.status,
          token: game.token,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt
        });
      });

      // Sort providers by priority and convert to array
      const sortedProviders: any[] = Object.values(allGroupedGames).sort((a: any, b: any) => {
        const aIndex = priorityProviders.indexOf(a.providerName);
        const bIndex = priorityProviders.indexOf(b.providerName);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        if (aIndex !== -1) {
          return -1;
        }
        
        if (bIndex !== -1) {
          return 1;
        }
        
        return a.providerName.localeCompare(b.providerName);
      });

      // For each provider, apply offset and limit to slice the games
      // This way we show a limited number of games per provider initially
      // and can load more games per provider as user scrolls
      const result = sortedProviders.map((providerGroup: any) => {
        // Slice games for this provider based on offset and limit
        const paginatedGames = providerGroup.games.slice(offset, offset + limit);
        
        return {
          providerName: providerGroup.providerName,
          games: paginatedGames,
          pagination: {
            offset,
            limit,
            total: providerGroup.games.length,
            hasMore: offset + limit < providerGroup.games.length
          }
        };
      });

      // Check if there are more games available in any provider
      const hasMore = sortedProviders.some((providerGroup: any) => 
        offset + limit < providerGroup.games.length
      );

      return {
        data: result,
        pagination: {
          offset,
          limit,
          hasMore
        }
      };
    } catch (error) {
      throw new Error(`Failed to get paginated grouped games: ${error.message}`);
    }
  }

  /**
   * Get games grouped by provider with progressive loading (non-looping infinite scroll)
   * Loads a limited number of games per provider initially, then loads more games
   * from the same provider on scroll until all games from that provider are shown,
   * then moves to the next provider.
   * 
   * @param providerOffset - Index of the provider to start from (0 for first provider)
   * @param gameOffset - Number of games to skip within the current provider
   * @param limit - Number of games to return per request (default 15)
   * @returns Games grouped by provider with pagination info
   */
  async getGamesProgressiveLoad(
    providerOffset: number = 0,
    gameOffset: number = 0,
    limit: number = 15
  ): Promise<any> {
    try {
      // Get all active games ordered by provider and name
      const allGames = await this.gapCasinoRepository.find({
        where: {
          status: true
        },
        order: {
          providerName: 'ASC',
          name: 'ASC',
        },
      });

      // Group all games by provider
      const allGroupedGames: { [key: string]: any } = {};
      const priorityProviders = ['SUNO', 'DC', 'EZUGI', 'RG'];
      
      allGames.forEach((game) => {
        // Normalize provider name to uppercase for consistent grouping
        const provider = (game.providerName || 'Unknown').toUpperCase();
        
        if (!allGroupedGames[provider]) {
          allGroupedGames[provider] = {
            providerName: provider,
            subProviderName: game.subProviderName || provider,
            games: []
          };
        }
        
        allGroupedGames[provider].games.push({
          id: game.id,
          gameId: game.gameId,
          name: game.name,
          gameCode: game.gameCode,
          category: game.category,
          providerName: game.providerName,
          subProviderName: game.subProviderName,
          urlThumb: game.urlThumb,
          status: game.status,
          token: game.token,
          createdAt: game.createdAt,
          updatedAt: game.updatedAt
        });
      });

      // Sort providers by priority and convert to array
      const sortedProviders: any[] = Object.values(allGroupedGames).sort((a: any, b: any) => {
        const aIndex = priorityProviders.indexOf(a.providerName);
        const bIndex = priorityProviders.indexOf(b.providerName);
        
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        
        if (aIndex !== -1) {
          return -1;
        }
        
        if (bIndex !== -1) {
          return 1;
        }
        
        return a.providerName.localeCompare(b.providerName);
      });

      // If providerOffset is beyond available providers, return empty result
      if (providerOffset >= sortedProviders.length) {
        return {
          data: [],
          pagination: {
            providerOffset,
            gameOffset,
            limit,
            hasMore: false,
            currentProvider: null,
            hasMoreGamesInCurrentProvider: false,
            hasMoreProviders: false
          }
        };
      }

      // Get the current provider based on providerOffset
      const currentProvider = sortedProviders[providerOffset];
      
      // Slice games for this provider based on gameOffset and limit
      const paginatedGames = currentProvider.games.slice(gameOffset, gameOffset + limit);
      
      // Check if there are more games in the current provider
      const hasMoreGamesInCurrentProvider = gameOffset + limit < currentProvider.games.length;
      
      // Check if there are more providers after the current one
      const hasMoreProviders = providerOffset + 1 < sortedProviders.length;
      
      // Determine if there's more data overall
      const hasMore = hasMoreGamesInCurrentProvider || hasMoreProviders;
      
      // Determine what to load next
      let nextProviderOffset = providerOffset;
      let nextGameOffset = gameOffset + limit;
      
      // If we've loaded all games from the current provider, move to the next provider
      if (!hasMoreGamesInCurrentProvider && hasMoreProviders) {
        nextProviderOffset = providerOffset + 1;
        nextGameOffset = 0;
      }

      const result = [{
        providerName: currentProvider.providerName,
        subProviderName: currentProvider.subProviderName,
        games: paginatedGames,
        totalGames: currentProvider.games.length
      }];

      return {
        data: result,
        pagination: {
          providerOffset: nextProviderOffset,
          gameOffset: nextGameOffset,
          limit,
          hasMore,
          currentProvider: currentProvider.providerName,
          hasMoreGamesInCurrentProvider,
          hasMoreProviders
        }
      };
    } catch (error) {
      throw new Error(`Failed to get progressively loaded games: ${error.message}`);
    }
  }
}