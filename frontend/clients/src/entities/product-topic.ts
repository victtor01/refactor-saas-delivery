import { Product } from "./product";
import { topicOption } from "./topic-options";

export interface ProductTopic {
  id: string;
  name: string;
  productId: string;
  product: Product;

  topicOptions?: topicOption[]
}
