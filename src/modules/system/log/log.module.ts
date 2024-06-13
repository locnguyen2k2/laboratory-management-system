import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLogEntity } from './entities/task-log.entity';
import { LoginLogEntity } from './entities/login-log.entity';
import { LogController } from './log.controller';
import { TaskLogService } from './task-log.service';
import { LoginLogService } from './login-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskLogEntity, LoginLogEntity])],
  controllers: [LogController],
  providers: [TaskLogService, LoginLogService],
  exports: [TaskLogService, LoginLogService],
})
export class LogModule {}
