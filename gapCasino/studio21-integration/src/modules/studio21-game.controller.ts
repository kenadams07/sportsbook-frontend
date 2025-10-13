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
import { Studio21GameService } from './studio21-game.service';
import type { Request, Response } from 'express';
import { SignatureService } from '../utils/signature.service';

@Controller('studio21-game')
export class Studio21GameController {
  constructor(
    private readonly studio21GameService: Studio21GameService,
    private readonly signatureService: SignatureService,
  ) {}

  @Get('game-url')
  async getStudio21GameUrl(
    @Query() requestParams: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const authUserId = req['user']?.id; // Assuming user is attached to request
      const result = await this.studio21GameService.getGameUrl(
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
  async getStudio21Balance(
    @Body() requestParams: any,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const encodedSignature = req.headers['signature'] as string;
      const result = await this.studio21GameService.getBalance(
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
      const result = await this.studio21GameService.placeBet(
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
      const result = await this.studio21GameService.processResult(
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
      const result = await this.studio21GameService.processRollback(
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
}