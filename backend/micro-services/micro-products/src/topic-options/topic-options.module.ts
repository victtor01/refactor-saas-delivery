import { Module } from '@nestjs/common';
import { TopicOptionsService } from './topic-options.service';
import { TopicOptionsController } from './topic-options.controller';
import { TopicOptionsRepository } from './repositories/topic-options-repository';
import { ImplementsTopicOptionsRepository } from './repositories/implements/implements-topic-option-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicOption } from './entities/topic-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TopicOption])],
  controllers: [TopicOptionsController],
  providers: [
    TopicOptionsService,
    {
      provide: TopicOptionsRepository,
      useClass: ImplementsTopicOptionsRepository,
    },
  ],
  exports: [TopicOptionsService, TopicOptionsService],
})
export class TopicOptionsModule {}
