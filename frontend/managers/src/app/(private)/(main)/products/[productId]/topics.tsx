"use client";

import { ProductTopic } from "@/interfaces/product-topic";

export const TopicsComponent = ({ topic }: { topic: ProductTopic }) => {
  return (
    <div key={topic.id} className="flex flex-col gap-1 w-auto p-2 rounded">
      <header className="flex justify-between w-auto items-center">
        <h1 className="font-semibold text-xl text-gray-600 dark:text-gray-200">
          {topic.name}
        </h1>
      </header>

      <div className="flex flex-col gap-2 pl-2 border-l-[0.2rem] ml-1 border-gray-300 dark:border-zinc-700">
        {topic?.topicOptions?.length === 0 && (
          <div className="font-semibold">Nenhuma opção adicionada</div>
        )}
        {topic?.topicOptions?.map((option) => {
          return (
            <div
              key={option.id}
              className="flex gap-3 items-center justify-between hover:bg-zinc-100 dark:hover:bg-zinc-700 dark:hover:bg-opacity-40 bg-opacity-50 p-1 pl-3 cursor-default"
            >
              <span className="font-semibold text-gray-500 dark:text-gray-200 capitalize text-lg">
                {option?.name}
              </span>
              <span className="px-3 p-1 bg-green-600 dark:bg-opacity-10 rounded text-white dark:text-emerald-300">
                R$ {option?.price}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
