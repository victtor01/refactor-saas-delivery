import { Injectable } from '@nestjs/common';
import { ProductTopicsRepository } from './repositories/product-topics-repository';
import { ProductTopic } from './entities/product-topic.entity';
import { Product } from 'src/products/entities/product.entity';
import { TopicOptionsService } from 'src/topic-options/topic-options.service';
import { TopicOption } from 'src/topic-options/entities/topic-option.entity';

@Injectable()
export class ProductTopicsService {
  constructor(
    private readonly productTopicsRepository: ProductTopicsRepository,
    private readonly topicOptionsService: TopicOptionsService,
  ) {}

  public async updateTopic() {}

  public async updateManyTopicsWithOptions(
    productTopics: ProductTopic[],
    product: Product,
  ): Promise<ProductTopic[]> {
    const productTopicsIdsToDelete = this.getTopicsIdsToDelete(
      productTopics,
      product,
    );

    if (productTopicsIdsToDelete.length > 0) {
      await this.productTopicsRepository.removeManyById(
        productTopicsIdsToDelete,
      );
    }

    const savedTopics = await this.saveProductTopics(productTopics, product);

    const optionsInBody = this.extractOptions(productTopics);
    const optionsInDatabase = this.extractOptions(product.productTopics || []);

    const topicOptionsIdsToDelete = this.getOptionsIdsToDelete(
      optionsInBody,
      optionsInDatabase,
    );

    if (topicOptionsIdsToDelete.length > 0) {
      await this.topicOptionsService.deleteMany(topicOptionsIdsToDelete);
    }

    await this.saveOptions(optionsInBody);

    return savedTopics;
  }

  private getTopicsIdsToDelete(
    productTopics: ProductTopic[],
    product: Product,
  ): string[] {
    return (
      product.productTopics
        ?.filter(
          (topic) =>
            !productTopics.some((topicInBody) => topicInBody.id === topic.id),
        )
        ?.map((productTopic) => productTopic.id) || []
    );
  }

  private async saveProductTopics(
    productTopics: ProductTopic[],
    product: Product,
  ): Promise<ProductTopic[]> {
    return (
      (await Promise.all(
        productTopics.map(async (productTopic, index) => {
          const serialize = new ProductTopic(
            { name: productTopic.name, productId: product.id },
            productTopic.id || null,
          );
          const savedTopic = await this.productTopicsRepository.save(serialize);
          productTopics[index].id = savedTopic.id;
          return savedTopic;
        }),
      )) || []
    );
  }

  private extractOptions(productTopics: ProductTopic[]): TopicOption[] {
    return (
      productTopics.flatMap((productTopic) =>
        productTopic.topicOptions.map((option) => ({
          ...option,
          topicProductId: productTopic.id,
        })),
      ) || []
    );
  }

  private getOptionsIdsToDelete(
    optionsInBody: TopicOption[],
    optionsInDatabase: TopicOption[],
  ): string[] {
    return (
      optionsInDatabase
        ?.filter(
          (optionInDatabase) =>
            !optionsInBody.some(
              (optionInBody) => optionInBody.id === optionInDatabase.id,
            ),
        )
        .map((option) => option.id) || []
    );
  }

  private async saveOptions(optionsInBody: TopicOption[]): Promise<void> {
    await Promise.all(
      optionsInBody.map((option) =>
        this.topicOptionsService.save(
          new TopicOption(
            {
              name: option.name,
              price: Number(option.price) || 0,
              topicProductId: option.topicProductId,
            },
            option.id || null,
          ),
        ),
      ),
    );
  }
}
