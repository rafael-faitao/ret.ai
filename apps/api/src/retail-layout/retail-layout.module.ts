import { Module } from '@nestjs/common';
import { RetailLayoutController } from './retail-layout.controller';
import { RetailLayoutService } from './retail-layout.service';

@Module({
  controllers: [RetailLayoutController],
  providers: [RetailLayoutService],
  exports: [RetailLayoutService],
})
export class RetailLayoutModule {}
