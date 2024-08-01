'use client';

import { api } from '@/api';
import ProductPreview from '@/components/product-preview';
import { ProductsCreateCategory } from '@/components/products/products-create-category';
import { ProductsCreateModel } from '@/components/products/products-create-model';
import { ProductsHeader } from '@/components/products/products-header';
import { useCategories } from '@/hooks/useCategories';
import { Product } from '@/interfaces/product';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { BiCategory, BiPlus } from 'react-icons/bi';

import Squeleton from './squeleton';

type Model = 'create' | 'create-category' | null;

const useProducts = () => {
  const searchParams = useSearchParams();
  const modelState: Model = (searchParams.get('model') as Model) || null;
  const categoryNameSelected: string | null =
    searchParams.get('category') || null;

  const {
    data: products,
    refetch,
    isLoading,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      return (await api.get(`/products/mine`)).data;
    },
  });

  useEffect(() => {
    refetch();
  }, [categoryNameSelected]);

  return {
    products,
    isLoading,
    modelState,
    refetch,
    categoryNameSelected,
  };
};

export default function Products() {
  const { data: categories } = useCategories().getCategories();
  const { products, isLoading, modelState, categoryNameSelected } =
    useProducts();

  const styleForNoCategorySelected =
    categoryNameSelected === null
      ? `bg-zinc-700 text-white shadow-xl`
      : `bg-white text-gray-700`;

  if (isLoading) return <Squeleton />;

  return (
    <>
      {modelState === 'create' && <ProductsCreateModel />}
      {modelState === 'create-category' && <ProductsCreateCategory />}

      <div>
        <ProductsHeader />

        <div className="p-3 px-6 flex gap-2 items-center font-semibold text-gray-600">
          <BiCategory size={20} />
          Categorias
        </div>

        <div className="w-full p-2 px-6 flex gap-3">
          <Link
            className={`p-2 px-4 capitalize font-semibold rounded ${styleForNoCategorySelected}`}
            href="?"
          >
            Todos
          </Link>

          {!!categories &&
            categories?.map((category) => {
              const selected = categoryNameSelected === category.name;
              const styleSelected = selected
                ? `bg-gray-700 text-white shadow-xl`
                : `bg-white text-gray-700 hover:translate-y-[-0.4rem] hover:shadow-xl`;
              return (
                <Link
                  key={category.id}
                  href={`?category=${category.name}`}
                  className={`p-2 px-4 capitalize font-semibold rounded-md
                    transition-all items-center flex
                    ${styleSelected}`}
                >
                  {category.name}
                </Link>
              );
            })}

          <Link
            href="?model=create-category"
            className="grid place-items-center w-11 h-10 bg-zinc-700 text-white rounded font-semibold bg-opacity-90 hover:opacity-100"
          >
            <BiPlus size={20}/>
          </Link>
        </div>

        <div className="flex flex-wrap gap-3 p-5">
          {products?.map((product, index: number) => {
            return (
              <ProductPreview key={index} product={product} index={index} />
            );
          })}
        </div>
      </div>
    </>
  );
}
