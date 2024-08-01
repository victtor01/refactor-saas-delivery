'use client';

import { api } from '@/api';
import { Category } from '@/interfaces/category';
import { Product } from '@/interfaces/product';
import { ProductTopic } from '@/interfaces/product-topic';
import { getImageProduct } from '@/utils/getImageProduct';
import { useQuery } from '@tanstack/react-query';

import Image from 'next/image';

import { FaArrowTrendUp } from 'react-icons/fa6';
import { IoMdCart, IoMdPricetag } from 'react-icons/io';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { VscListFlat } from 'react-icons/vsc';

import { TopicsComponent } from './topics';

type ProductProps = {
  params: {
    productId: string;
  };
};

const useProduct = (productId: string) => {
  const { data: product } = useQuery<Product>({
    queryKey: ['products', productId],
    queryFn: async () => {
      return (await api.get(`/products/mine/${productId}`)).data;
    },
  });

  return {
    product,
  };
};

export default function ProductInformations({ params }: ProductProps) {
  const { productId } = params;
  const { product } = useProduct(productId);
  const imagePreview = getImageProduct(product?.photo);

  return (
    <section
      className="flex mx-auto bg-white w-full max-w-[50rem]
      flex-col border overflow-auto dark:border-zinc-700
      dark:bg-zinc-800 my-auto rounded gap-4 m-10"
    >
      <header className="p-4 px-8 border-b-2 dark:border-zinc-600 bg-rose-600">
        <div className="text-gray-200">
          Produto <b>{product?.name}</b>
        </div>
      </header>

      <div className="flex flex-col rounded-xl">
        <section className="flex gap-3 px-8 pt-4">
          <div
            className="w-[10rem] h-[10rem] 
              bg-white shadow rounded-md
              grid place-items-center dark:bg-zinc-700 dark:bg-opacity-40
              relative overflow-hidden"
          >
            {imagePreview && (
              <Image
                quality={20}
                alt="imagem do produto"
                src={imagePreview}
                style={{ objectFit: 'cover' }}
                layout="fill"
                sizes="(max-width: 768px) 2rem,
                (max-width: 1200px) 2rem, 33vw"
              />
            )}
          </div>

          <div className="flex flex-col bg-white p-2 px-3 rounded-lg flex-1 dark:bg-zinc-700 dark:bg-opacity-40">
            <span className="text-gray-500 font-semibold flex items-center gap-3 dark:text-gray-300">
              <VscListFlat size={17} />
              Descrição
            </span>
            <span
              className="text-lg font-semibold text-zinc-700 
                capitalize dark:text-zinc-100"
            >
              {product?.description || 'Sem descrição.'}
            </span>
          </div>
        </section>

        <section
          className="grid grid-cols-2 flex-1 h-auto w-full 
          flex-wrap gap-3 *:whitespace-nowrap px-8 mt-5"
        >
          <div className="flex flex-col gap-1">
            <span className="flex items-center w-full gap-2 font-semibold  text-gray-500 text-md dark:text-gray-300">
              <MdDriveFileRenameOutline size={17} />
              Nome
            </span>
            <div
              className="transparent outline-none resize-none
                rounded-md border-2 border-transparent bg-zinc-50 p-2
                focus:border-orange-500 h-auto dark:bg-zinc-700
                dark:bg-opacity-40 dark:placeholder:text-gray-500"
            >
              {product?.name}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex items-center w-full gap-2 font-semibold text-gray-500 text-md dark:text-gray-300">
              <IoMdCart />
              Quantidade
            </span>
            <div
              className="transparent outline-none resize-none
              rounded-md border-2 border-transparent bg-zinc-50 p-2
              focus:border-orange-500 h-auto dark:bg-zinc-700
              dark:bg-opacity-40 dark:placeholder:text-gray-500"
            >
              {product?.quantity}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span
              className="flex items-center w-full gap-2 font-semibold 
                text-gray-500 text-md dark:text-gray-300"
            >
              <IoMdPricetag size={17} />
              Preço
            </span>
            <div
              className="transparent outline-none resize-none
              rounded-md border-2 border-transparent bg-zinc-50 p-2
              focus:border-orange-500 h-auto dark:bg-zinc-700 font-semibold
              dark:bg-opacity-40 dark:placeholder:text-gray-500"
            >
              R$ {product?.price}
            </div>
          </div>
        </section>

        <section
          className="flex flex-col gap-3
            dark:border-zinc-700 border-t mt-5 relative"
        >
          <div className="absolute top-0 left-[2rem] translate-y-[-50%]">
            <span className="rounded-md bg-gray-700 text-white p-1 px-2 text-sm">
              Categories
            </span>
          </div>

          <div className="flex p-8">
            {product?.categories?.map((category: Category) => (
              <div
                key={category.id}
                className="flex gap-1 w-auto bg-gray-50 p-1 px-3 border rounded-lg dark:bg-zinc-700 cursor-default"
              >
                <div className="font-semibold text-lg text-gray-600 dark:text-gray-200">
                  {category.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3 dark:border-zinc-700 border-t relative">
          <div className="absolute top-0 left-[2rem] translate-y-[-50%]">
            <span className="rounded-md bg-gray-700 text-white p-1 px-2 text-sm">
              Tópicos
            </span>
          </div>

          <div className="flex flex-col p-8 gap-4 max-h-[20rem] overflow-auto">
            {product?.productTopics?.map((topic: ProductTopic) => (
              <TopicsComponent key={topic.id} topic={topic} />
            ))}
          </div>
        </section>

        <footer className="w-full border-t p-8 px-8 dark:border-gray-700 relative">
          <div className="absolute top-0 left-[2rem] translate-y-[-50%]">
            <span className="rounded-md bg-gray-700 text-white p-1 px-2 text-sm">
              Outras opções
            </span>
          </div>

          <button
            className="flex items-center gap-3
            p-2 px-3 bg-gradient-to-r from-rose-600 to-red-600 rounded text-gray-200
            opacity-90 hover:opacity-100"
          >
            <FaArrowTrendUp />
            Pedidos recentes
          </button>
        </footer>
      </div>
    </section>
  );
}
