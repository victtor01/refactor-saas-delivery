import { IsNumber, IsString } from "class-validator";
import { UUID } from "crypto";

export class TopicOption {
  @IsString()
  id?: UUID | null;
  
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  topicProductId: string;
}
