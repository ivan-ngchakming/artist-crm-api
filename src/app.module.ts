import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { AddressesModule } from './addresses/addresses.module';
import pgConfig from './config/postgres.config';

@Module({
  imports: [TypeOrmModule.forRoot(pgConfig), CustomersModule, AddressesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
