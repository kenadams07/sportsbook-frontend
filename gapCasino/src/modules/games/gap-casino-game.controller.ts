import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Req,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { GapCasinoGameService } from './gap-casino-game.service';
import type { Request, Response } from 'express';
import { SignatureService } from '../../common/utils/signature.service';

@Controller('gap-casino-game')
export class GapCasinoGameController {
  constructor(
    private readonly gapCasinoGameService: GapCasinoGameService,
    private readonly signatureService: SignatureService,
  ) {}

  @Post('games-db')
  async getGapCasinoGamesDB(@Body() requestParams: any, @Res() res: Response) {
    try {
      const result = await this.gapCasinoGameService.getGamesFromDB(requestParams);
      return res.status(HttpStatus.OK).json({
        data: result,
        status: 'success',
        message: 'Games retrieved successfully',
      });
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tabs-db')
  async getGapCasinoTabsDB(@Res() res: Response) {
    try {
      const result = await this.gapCasinoGameService.getTabsFromDB();
      return res.status(HttpStatus.OK).json({
        data: result,
        status: 'success',
        message: 'Tabs retrieved successfully',
      });
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('games')
  async getGapCasinoGames(@Res() res: Response) {
    try {
      const result = await this.gapCasinoGameService.getGames();
      return res.status(HttpStatus.OK).json({
        data: result,
        status: 'success',
        message: 'Games retrieved successfully',
      });
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('providers/all')
  async getAllGamesGroupedByProvider() {
    try {
      const result = await this.gapCasinoGameService.getGamesGroupedByProvider();
      return {
        data: result,
        status: 'success',
        message: 'All games grouped by provider retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('providers/batch')
  async getGamesGroupedByProviderBatch(
    @Query('batchNumber') batchNumber: number = 0,
    @Query('batchSize') batchSize: number = 100,
  ) {
    try {
      const result = await this.gapCasinoGameService.getGamesGroupedByProviderBatch(batchNumber, batchSize);
      return {
        data: result.data,
        pagination: result.pagination,
        status: 'success',
        message: 'Games batch retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('providers/continuous-batch')
  async getGamesGroupedByProviderContinuousBatch(
    @Query('batchNumber') batchNumber: number = 0,
    @Query('batchSize') batchSize: number = 200,
  ) {
    try {
      const result = await this.gapCasinoGameService.getGamesGroupedByProviderContinuousBatch(batchNumber, batchSize);
      return {
        data: result.data,
        pagination: result.pagination,
        status: 'success',
        message: 'Games continuous batch retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('providers/names')
  async getProviderNamesOnly() {
    try {
      const result = await this.gapCasinoGameService.getProviderNamesOnly();
      return {
        data: result,
        status: 'success',
        message: 'Provider names retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('providers/games')
  async getGamesGroupedByProviderOptimized(
    @Query('batchNumber') batchNumber: number = 0,
    @Query('batchSize') batchSize: number = 200,
    @Query('providerName') providerName?: string,
    @Query('search') searchQuery?: string,
  ) {
    try {
      const result = await this.gapCasinoGameService.getGamesGroupedByProviderOptimized(
        batchNumber, 
        batchSize, 
        providerName, 
        searchQuery
      );
      return {
        data: result.data,
        pagination: result.pagination,
        status: 'success',
        message: 'Games retrieved successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('game-url')
  async getGapCasinoGameUrl(
    @Query() requestParams: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const authUserId = req['user']?.id; // Assuming user is attached to request
      const result = await this.gapCasinoGameService.getGameUrl(
        requestParams,
        authUserId,
      );
      return res.status(HttpStatus.OK).json({
        data: result,
        status: 'success',
        message: 'Game URL retrieved successfully',
      });
    } catch (error) {
      if (error.message === 'Game not found') {
        throw new HttpException(
          {
            status: 'error',
            message: 'Game not found',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('balance')
  async getGapBalance(
    @Body() requestParams: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const encodedSignature = req.headers['signature'] as string;
      const result = await this.gapCasinoGameService.getBalance(
        requestParams,
        encodedSignature,
      );
      res.setHeader('content-type', 'application/json');
      res.setHeader(
        'Signature',
        await this.signatureService.createSignature(JSON.stringify(result)),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @Post('bet')
  async bet(
    @Body() requestParams: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const encodedSignature = req.headers['signature'] as string;
      const result = await this.gapCasinoGameService.placeBet(
        requestParams,
        encodedSignature,
      );
      res.setHeader('content-type', 'application/json');
      res.setHeader(
        'Signature',
        await this.signatureService.createSignature(JSON.stringify(result)),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @Post('result')
  async resultRequest(
    @Body() requestParams: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const encodedSignature = req.headers['signature'] as string;
      const result = await this.gapCasinoGameService.processResult(
        requestParams,
        encodedSignature,
      );
      res.setHeader('content-type', 'application/json');
      res.setHeader(
        'Signature',
        await this.signatureService.createSignature(JSON.stringify(result)),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @Post('rollback')
  async rollbackRequest(
    @Body() requestParams: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const encodedSignature = req.headers['signature'] as string;
      const result = await this.gapCasinoGameService.processRollback(
        requestParams,
        encodedSignature,
      );
      res.setHeader('content-type', 'application/json');
      res.setHeader(
        'Signature',
        await this.signatureService.createSignature(JSON.stringify(result)),
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: error.message,
      });
    }
  }

  @Post('update-tokens')
  async updateExistingTokens(@Res() res: Response) {
    try {
      await this.gapCasinoGameService.updateTokens();
      return res.status(HttpStatus.OK).json({
        status: 'success',
        message: 'Token updating completed',
      });
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}