'use client';

import { api } from '@/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link } from 'next-view-transitions';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { useSearchParams } from 'next/navigation';

import { FaTrash } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { MdDriveFileRenameOutline } from 'react-icons/md';

const updateCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
});

type UpdateCategory = z.infer<typeof updateCategorySchema>;

const useProductsCreateCateogory = (id: string) => {
  const form = useForm<UpdateCategory>({
    resolver: zodResolver(updateCategorySchema),
  });

  const updateCategory = async ({ name }: UpdateCategory) => {
    const response = api.put(`/products/categories/${id}`, {
      name,
    });

    await toast.promise(response, {
      pending: 'Atualizando categoria...',
      success: 'Atualizado com sucesso!',
      error: 'Houve um erro ao tentar atualizar categoria!',
    });
  };

  return {
    form,
    updateCategory,
  };
};

function ProductsEditCategoryModal() {
  const params = useSearchParams();
  const id = params.get('id');
  if (!id) return;

  const { form, updateCategory } = useProductsCreateCateogory(id);

  const {
    register,
    formState: { isSubmitting, errors },
  } = form;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-full h-screen overflow-auto 
      grid place-items-center bg-black bg-opacity-50 backdrop-blur-sm z-30"
    >
      <form
        onSubmit={form.handleSubmit(updateCategory)}
        className="p-10 bg-gray-100 rounded-xl w-full max-w-[30rem] flex flex-col gap-5"
      >
        <header className="flex items-center justify-between w-full text-xl font-semibold">
          <h1 className="text-transparent bg-clip-text bg-rose-600">
            Editar Categoria
          </h1>

          <div className="flex items-center gap-5">
            <button
              className="text-zinc-600 dark:text-zinc-400 p-3 bg-white rounded-full 
              dark:bg-zinc-700 hover:opacity-100 opacity-90 hover:shadow"
            >
              <FaTrash size={18} />
            </button>

            <Link
              href={'?'}
              className="text-zinc-600 dark:text-zinc-400 p-3 bg-white rounded-full dark:bg-zinc-700 
              hover:opacity-100 opacity-90 hover:shadow"
            >
              <IoClose size={20} />
            </Link>
          </div>
        </header>

        <section className="flex flex-col gap-2">
          <label htmlFor="name" className="flex flex-col gap-1">
            <span className="flex items-center w-full gap-2 font-semibold text-gray-500 text-md dark:text-gray-300">
              <MdDriveFileRenameOutline size={17} />
              Nome
            </span>
            <input
              {...register('name')}
              type="text"
              placeholder="Produto01"
              className="p-2 bg-white border-2 border-transparent rounded-md shadow outline-none focus:border-orange-500 dark:bg-zinc-700 dark:bg-opacity-40 dark:placeholder:text-gray-500"
            />
            {errors?.name && (
              <div className="font-semibold text-red-500">
                {errors?.name?.message}
              </div>
            )}
          </label>
        </section>

        <footer className="w-full mt-4">
          <button className="w-full p-2 bg-gradient-45 from-orange-600 to-rose-600 text-white rounded opacity-95 hover:opacity-100">
            Editar
          </button>
        </footer>
      </form>
    </motion.div>
  );
}

export { ProductsEditCategoryModal };
