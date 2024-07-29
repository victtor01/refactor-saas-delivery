import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TopicOptionsService } from './topic-options.service';
import { CreateTopicOptionDto } from './dto/create-topic-option.dto';
import { UpdateTopicOptionDto } from './dto/update-topic-option.dto';

@Controller()
export class TopicOptionsController {
  constructor(private readonly topicOptionsService: TopicOptionsService) {}

  @MessagePattern({ cmd: 'topicOptions', action: 'create' })
  public async create() {
    return;
  }
}
