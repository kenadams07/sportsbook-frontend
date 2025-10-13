import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Studio21Game } from '../entities/studio21-game.entity';
import { Studio21Transaction, TransactionStatus } from '../entities/studio21-transaction.entity';
import { Studio21UserToken } from '../entities/studio21-user-token.entity';
import { User } from '../entities/user.entity';
import { SignatureService } from '../utils/signature.service';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class Studio21GameService {
  private gamesCache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(
    @InjectRepository(Studio21Game)
    private studio21GameRepository: Repository<Studio21Game>,
    @InjectRepository(Studio21Transaction)
    private studio21TransactionRepository: Repository<Studio21Transaction>,
    @InjectRepository(Studio21UserToken)
    private studio21UserTokenRepository: Repository<Studio21UserToken>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private signatureService: SignatureService,
  ) {}

  async getGameUrl(requestParams: any, authUserId: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: authUserId },
      });

      const apiUrl = `${process.env.STUDIO21_BASE_URL}/login`;

      const requestData = {
        operatorId: process.env.STUDIO21_OPERATOR_ID,
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

      await this.studio21UserTokenRepository.delete({
        userId: user?.id,
        createdAt: Between(yesterdayStart, yesterdayEnd),
      });

      const userToken = this.studio21UserTokenRepository.create({
        userId: user?.id,
        studio21_token: response?.data?.token,
      });
      await this.studio21UserTokenRepository.save(userToken);

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

        const studio21Token = await this.studio21UserTokenRepository.findOne({
          where: {
            userId: user?.id,
            studio21_token: requestParams?.token,
          },
        });

        if (!studio21Token || studio21Token.studio21_token !== requestParams?.token) {
          return { status: 'OP_TOKEN_NOT_FOUND' };
        }

        let balance = user?.balance || 0;

        // Assuming PKR handling, you might want to adjust this based on your actual currency logic
        if (user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR') {
          balance = balance / 1000; // Assuming STUDIO21.PKR value
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
          debitAmount = (parseFloat(debitAmount) * 1000).toString(); // Assuming STUDIO21.PKR value
        }

        if (requestParams.gameId === '') {
          data = { status: 'OP_INVALID_PARAMS' };
        } else {
          if (user !== null) {
            if (user && user.betAllow && user.status == '1') {
              if (parseFloat(debitAmount) < 0) {
                data = { status: 'OP_ERROR_NEGATIVE_DEBIT_AMOUNT' };
              } else {
                const studio21Token = await this.studio21UserTokenRepository.findOne({
                  where: {
                    userId: user?.id,
                    studio21_token: requestParams?.token,
                  },
                });

                if (!studio21Token || studio21Token.studio21_token !== requestParams.token) {
                  data = { status: 'OP_TOKEN_EXPIRED' };
                } else {
                  let balance = user.balance;
                  const game = await this.studio21GameRepository.findOne({
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
                      const checkStatement = await this.studio21TransactionRepository.find({
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

                          const transaction = this.studio21TransactionRepository.create({
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
                          await this.studio21TransactionRepository.save(transaction);

                          let updatedBalance = user?.balance;
                          updatedBalance -= parseFloat(debitAmount);
                          await this.userRepository.update(user.id, {
                            balance: updatedBalance,
                          });

                          // Assuming PKR handling, you might want to adjust this based on your actual currency logic
                          if (user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR') {
                            balance = balance / 1000; // Assuming STUDIO21.PKR value
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
          creditAmount = (parseFloat(creditAmount) * 1000).toString(); // Assuming STUDIO21.PKR value
        }

        if (requestParams.gameId === '') {
          data = { status: 'OP_INVALID_PARAMS' };
        } else {
          if (user !== null) {
            if (user && user.betAllow && user.status == '1') {
              const studio21Token = await this.studio21UserTokenRepository.findOne({
                where: {
                  userId: user?.id,
                  studio21_token: requestParams?.token,
                },
              });

              if (!studio21Token || studio21Token.studio21_token !== requestParams.token) {
                data = { status: 'OP_TOKEN_EXPIRED' };
              } else {
                const game = await this.studio21GameRepository.findOne({
                  where: {
                    gameId: requestParams.gameId,
                  },
                });

                if (game === null) {
                  data = { status: 'OP_INVALID_GAME' };
                } else {
                  const checkStatement = await this.studio21TransactionRepository.findOne({
                    where: {
                      userId: user.id,
                      roundId: requestParams.roundId,
                      txnId: requestParams.transactionId,
                    },
                  });

                  const checkDuplicateReqId = await this.studio21TransactionRepository.findOne({
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

                          await this.studio21TransactionRepository.update(checkStatement.id, {
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

                          let checkRTxn = await this.studio21TransactionRepository.findOne({
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

                            await this.studio21TransactionRepository.update(checkRTxn.id, {
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

                          await this.studio21TransactionRepository.update(checkStatement.id, {
                            postBalance: userBalance?.balance,
                          });

                          // Assuming PKR handling, you might want to adjust this based on your actual currency logic
                          if (user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR') {
                            balance = balance / 1000; // Assuming STUDIO21.PKR value
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
          amount = (parseFloat(amount) * 1000).toString(); // Assuming STUDIO21.PKR value
        }

        if (requestParams.gameId === '') {
          data = { status: 'OP_INVALID_PARAMS' };
        } else {
          if (user) {
            const studio21Token = await this.studio21UserTokenRepository.findOne({
              where: {
                userId: user?.id,
                studio21_token: requestParams?.token,
              },
            });

            if (studio21Token && studio21Token.studio21_token === requestParams.token) {
              if (user && user.betAllow && user.status == '1') {
                balance = user.balance;

                const checkStatement = await this.studio21TransactionRepository.findOne({
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
                    await this.studio21TransactionRepository.update(
                      { userId: user?.id },
                      {
                        roundId: requestParams.roundId,
                        txnId: requestParams.transactionId,
                        reqId: requestParams.reqId,
                        status: TransactionStatus.ROLLBACK,
                      },
                    );

                    await this.studio21TransactionRepository.delete({
                      userId: user.id,
                      txnId: requestParams.transactionId,
                      roundId: requestParams.roundId,
                      // Note: type field doesn't exist in Studio21Transaction entity
                    });

                    balance += parseFloat(amount);

                    let updatedBalance = user?.balance;
                    updatedBalance += parseFloat(amount);
                    await this.userRepository.update(user.id, {
                      balance: updatedBalance,
                    });

                    // Assuming PKR handling, you might want to adjust this based on your actual currency logic
                    if (user?.currencyId && user?.currencyId?.toUpperCase() === 'PKR') {
                      balance = balance / 1000; // Assuming STUDIO21.PKR value
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

  private generateToken(id: string): string {
    // Simple token generation - you might want to use a more secure method
    return `${id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}