import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Exposure } from './exposure.entity';
import { Users } from '../users/users.entity';

@Injectable()
export class ExposureService {
  private readonly logger = new Logger(ExposureService.name);

  constructor(
    @InjectRepository(Exposure)
    private exposureRepository: Repository<Exposure>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private entityManager: EntityManager,
  ) {}

  async findAll(): Promise<Exposure[]> {
    return this.exposureRepository.find({
      relations: ['user'],
    });
  }

  async findAllByUserId(userId: string): Promise<Exposure[]> {
    try {
      return await this.exposureRepository.find({
        where: {
          user: { id: userId },
        },
        relations: ['user'],
      });
    } catch (error) {
      this.logger.error('Error finding exposures by user ID', error.stack);
      throw error;
    }
  }

  async create(exposure: Partial<Exposure>): Promise<Exposure> {
    try {
      const newExposure = this.exposureRepository.create(exposure);
      return await this.exposureRepository.save(newExposure);
    } catch (error) {
      this.logger.error('Error creating exposure', error.stack);
      throw error;
    }
  }

  /**
   * Upsert exposure data for a user in a specific market
   * If an exposure record exists for the user, market, and event, it updates it
   * Otherwise, it creates a new record
   */
  async upsertExposure(payload: {
    marketId: string;
    eventId?: string;
    userId: string;
    is_clear: string;
    marketType: string;
    exposure: number;
  }): Promise<Exposure> {
    const { marketId, eventId, userId, is_clear, marketType, exposure } = payload;

    // Validate that user exists
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validate that exposure is a number
    if (typeof exposure !== 'number') {
      throw new Error('Exposure must be a number');
    }

    try {
      // Use TypeORM's upsert functionality (PostgreSQL)
      return await this.entityManager.transaction(async (transactionalEntityManager) => {
        // First, try to find existing exposure record by userId, marketId, and eventId
        const whereCondition: any = {
          marketId: marketId,
          user: { id: userId },
        };
        
        // Only include eventId in the search if it's provided
        if (eventId !== undefined) {
          whereCondition.eventId = eventId;
        } else {
          // If eventId is not provided, look for records where eventId is null
          whereCondition.eventId = null;
        }
        
        let existingExposure = await transactionalEntityManager.findOne(Exposure, {
          where: whereCondition,
        });

        if (existingExposure) {
          // Update existing record
          existingExposure.is_clear = is_clear;
          existingExposure.marketType = marketType;
          // Only update eventId if it's provided in the payload
          if (eventId !== undefined) {
            existingExposure.eventId = eventId;
          }
          
          // If is_clear is "false", add the new exposure to the current exposure
          // Otherwise, replace the exposure with the new value
          if (is_clear === "false") {
            // Ensure both values are numbers before addition
            const currentExposure = typeof existingExposure.exposure === 'number' 
              ? existingExposure.exposure 
              : parseFloat(existingExposure.exposure as any) || 0;
              
            const newExposure = typeof exposure === 'number' 
              ? exposure 
              : parseFloat(exposure as any) || 0;
              
            existingExposure.exposure = parseFloat((currentExposure + newExposure).toFixed(2));
          } else {
            existingExposure.exposure = exposure;
          }
          
          return await transactionalEntityManager.save(Exposure, existingExposure);
        } else {
          // Create new record
          const newExposure = transactionalEntityManager.create(Exposure, {
            marketId: marketId,
            eventId: eventId,
            user: { id: userId },
            is_clear,
            marketType,
            exposure,
          });
          return await transactionalEntityManager.save(Exposure, newExposure);
        }
      });
    } catch (error) {
      this.logger.error('Error upserting exposure', error.stack);
      throw error;
    }
  }

  /**
   * Find exposure by user ID, market ID, and optionally event ID
   */
  async findExposureByUserAndMarket(userId: string, marketId: string, eventId?: string): Promise<Exposure | null> {
    try {
      const whereCondition: any = {
        marketId: marketId,
        user: { id: userId },
      };
      
      // Only include eventId in the search if it's provided
      if (eventId !== undefined) {
        whereCondition.eventId = eventId;
      } else {
        // If eventId is not provided, look for records where eventId is null
        whereCondition.eventId = null;
      }
      
      return await this.exposureRepository.findOne({
        where: whereCondition,
        relations: ['user'],
      });
    } catch (error) {
      this.logger.error('Error finding exposure', error.stack);
      throw error;
    }
  }

  /**
   * Update exposure by ID
   */
  async updateExposure(id: string, updateData: Partial<Exposure>): Promise<Exposure> {
    try {
      const exposure = await this.exposureRepository.findOne({ where: { id } });
      if (!exposure) {
        throw new NotFoundException(`Exposure with ID ${id} not found`);
      }

      Object.assign(exposure, updateData);
      return await this.exposureRepository.save(exposure);
    } catch (error) {
      this.logger.error('Error updating exposure', error.stack);
      throw error;
    }
  }
}