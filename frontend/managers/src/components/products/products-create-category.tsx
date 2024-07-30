"use client";

import { api } from "@/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Link } from "next-view-transitions";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

type CreateCategory = z.infer<typeof createCategorySchema>;

const useProductsCreateCateogory = () => {
  const form = useForm<CreateCategory>({
    resolver: zodResolver(createCategorySchema),
  });

  const createCategory = async ({ name }: CreateCategory) => {
    try {
      const created = await toast.promise(
        api.post("/products/categories", {
          name,
        }),
        {
          success: "Criado com sucesso!",
          error: "Houve um erro",
          pending: "Criando uma nova categoria...",
        }
      );

      console.log(created);
    } catch (error) {}
  };

  return {
    form,
    createCategory,
  };
};

function ProductsCreateCategory() {
  const { form, createCategory } = useProductsCreateCateogory();

  const { register, formState } = form;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-full h-screen overflow-auto 
      grid place-items-center bg-black bg-opacity-50 backdrop-blur-sm z-30"
    >
      <form
        onSubmit={form.handleSubmit(createCategory)}
        className="p-10 bg-gray-100 rounded-xl w-full max-w-[30rem] flex flex-col gap-5"
      >
        <header className="flex items-center justify-between w-full text-xl font-semibold">
          <h1 className="text-transparent bg-clip-text bg-gradient-45 from-orange-500 to-red-500">
            Criar uma novo produto.
          </h1>
          <Link
            href={"?"}
            className="p-3 bg-white rounded-full dark:bg-zinc-700 hover:opacity-100 opacity-90 hover:shadow"
          >
            <IoClose />
          </Link>
        </header>

        <section className="flex flex-col gap-2">
          <label htmlFor="name" className="flex flex-col gap-1">
            <span className="flex items-center w-full gap-2 font-semibold text-gray-500 text-md dark:text-gray-300">
              <MdDriveFileRenameOutline size={17} />
              Nome
            </span>
            <input
              {...register("name")}
              type="text"
              placeholder="Produto01"
              className="p-2 bg-white border-2 border-transparent rounded-md shadow outline-none focus:border-orange-500 dark:bg-zinc-700 dark:bg-opacity-40 dark:placeholder:text-gray-500"
            />
            {formState?.errors?.name && (
              <div className="font-semibold text-red-500">
                {formState?.errors?.name?.message}
              </div>
            )}
          </label>
        </section>

        <footer className="w-full">
          <button className="w-full p-2 bg-rose-600 text-white rounded opacity-95 hover:opacity-100">
            Criar
          </button>
        </footer>
      </form>
    </motion.div>
  );
}

export { ProductsCreateCategory };
