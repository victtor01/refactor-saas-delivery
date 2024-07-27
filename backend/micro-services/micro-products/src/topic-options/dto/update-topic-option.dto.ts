import { PartialType } from '@nestjs/mapped-types';
import { CreateTopicOptionDto } from './create-topic-option.dto';

export class UpdateTopicOptionDto extends PartialType(CreateTopicOptionDto) {
  id: number;
}
