import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginHistory } from './login-history.entity';

@Injectable()
export class LoginHistoryService {
  constructor(
    @InjectRepository(LoginHistory)
    private loginHistoryRepository: Repository<LoginHistory>,
  ) {}

  async create(loginHistoryData: Partial<LoginHistory>): Promise<LoginHistory> {
    const loginHistory = this.loginHistoryRepository.create(loginHistoryData);
    return this.loginHistoryRepository.save(loginHistory);
  }

  async findByEmailAndIPs(email: string, system_ip: string | undefined, browser_ip: string | undefined): Promise<LoginHistory | null> {
    const whereCondition: any = { email };
    
    if (system_ip) {
      whereCondition.system_ip = system_ip;
    } else {
      whereCondition.system_ip = null;
    }
    
    if (browser_ip) {
      whereCondition.browser_ip = browser_ip;
    } else {
      whereCondition.browser_ip = null;
    }
    
    return this.loginHistoryRepository.findOne({
      where: whereCondition
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.loginHistoryRepository.update(id, {
      last_login: new Date()
    });
  }

  async findAll(): Promise<LoginHistory[]> {
    return this.loginHistoryRepository.find();
  }
}