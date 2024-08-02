'use client';

import { api } from '@/api';
import ProductPreview from '@/components/product-preview';
import { ProductsCreateCategory } from '@/components/products/products-create-category';
import { ProductsCreateModel } from '@/components/products/products-create-model';
import { ProductsEditCategoryModal } from '@/components/products/products-edit-category';
import { ProductsHeader } from '@/components/products/products-header';
import { useCategories } from '@/hooks/useCategories';
import { Product } from '@/interfaces/product';
import { useQuery } from '@tanstack/react-query';
import { ElementType, useEffect } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { BiCategory, BiPlus } from 'react-icons/bi';
import { HiDotsHorizontal } from 'react-icons/hi';

import Squeleton from './squeleton';

const models = {
  ['create']: ProductsCreateModel,
  ['create-category']: ProductsCreateCategory,
  ['edit-category']: ProductsEditCategoryModal,
};

type Models = 'create' | 'create-category' | 'edit-category';

const useProducts = () => {
  const searchParams = useSearchParams();
  const modelState: Models | null =
    (searchParams.get('model') as Models) || null;
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

  const classSelected = `text-gray-600 bg-white shadow-gray-300 shadow-inner pointer-events-none`;
  const classNotSelected = `bg-white text-gray-700 hover:translate-y-[-0.2rem] shadow hover:shadow-lg`;

  const styleForNoCategorySelected =
    categoryNameSelected === null ? classSelected : classNotSelected;

  if (isLoading) return <Squeleton />;

  const Component = (modelState ? models[modelState] : <></>) as ElementType;

  return (
    <>
      {modelState && <Component />}

      <div>
        <ProductsHeader />

        <div className="p-3 px-6 flex gap-2 items-center font-semibold text-gray-600">
          <BiCategory size={20} />
          Categorias
        </div>

        <div className="w-full p-2 px-6 flex gap-3 items-center">
          <Link
            className={`p-2 px-4 capitalize font-semibold rounded transition-all 
              ${styleForNoCategorySelected}`}
            href="?"
          >
            Todos
          </Link>

          {!!categories &&
            categories?.map((category) => {
              const selected = categoryNameSelected === category.name;
              const styleSelected = selected ? classSelected : classNotSelected;
              return (
                <Link
                  key={category.id}
                  href={`?category=${category.name}`}
                  className={`p-2 px-4 capitalize font-semibold rounded-md
                    transition-all items-center flex gap-1
                    ${styleSelected}`}
                >
                  {category.name}

                  {selected && (
                    <Link
                      className="w-5 h-5 grid place-items-center pointer-events-auto"
                      href={{
                        pathname: '/products',
                        query: {
                          model: 'edit-category',
                          id: category.id,
                        },
                      }}
                    >
                      <HiDotsHorizontal />
                    </Link>
                  )}
                </Link>
              );
            })}

          <Link
            href="?model=create-category"
            className="grid place-items-center w-8 h-8 bg-zinc-700 text-white rounded font-semibold bg-opacity-90 hover:opacity-100"
          >
            <BiPlus size={20} />
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
