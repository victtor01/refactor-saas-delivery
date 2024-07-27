import { ProductTopic } from "./product-topic";

export interface topicOption {
  id: string;
  name: string;
  price: number;
  
  topicId?: string;
  topic?: ProductTopic;

}