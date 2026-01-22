import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  async create(userId: string): Promise<Wallet> {
    const wallet = this.walletRepository.create({ userId, balance: 0 });
    return this.walletRepository.save(wallet);
  }

  async findByUserId(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({
      where: { userId },
    });

    if (!wallet) {
      return this.create(userId);
    }

    return wallet;
  }

  async addBalance(userId: string, amount: number): Promise<Wallet> {
    const wallet = await this.findByUserId(userId);
    wallet.balance = Number(wallet.balance) + amount;
    return this.walletRepository.save(wallet);
  }

  async deductBalance(userId: string, amount: number): Promise<Wallet> {
    const wallet = await this.findByUserId(userId);
    
    if (Number(wallet.balance) < amount) {
      throw new Error('Insufficient balance');
    }

    wallet.balance = Number(wallet.balance) - amount;
    return this.walletRepository.save(wallet);
  }

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.findByUserId(userId);
    return Number(wallet.balance);
  }
}
