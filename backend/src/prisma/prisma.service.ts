import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OnModuleInit,OnModuleDestroy } from '@nestjs/common';
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {
    async onModuleInit() {
         this.$connect
    }
    async onModuleDestroy() {
         this.$disconnect
    }
}
