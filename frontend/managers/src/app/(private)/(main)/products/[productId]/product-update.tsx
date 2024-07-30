"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/api";
import { Product } from "@/interfaces/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import {
  Control,
  Controller,
  FormProvider,
  UseFormRegister,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { IoMdPhotos, IoMdPricetag } from "react-icons/io";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { VscListFlat } from "react-icons/vsc";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { queryClient } from "@/providers/query-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getImageProduct } from "@/utils/getImageProduct";
import { PiPlus } from "react-icons/pi";
import { BiMinus } from "react-icons/bi";
import { z } from "zod";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/interfaces/category";
import { OptionComponent } from "./option";

const CONDITION_TO_NULL_PHOTO = "NOTFOUND";

type ParamProps = {
  [key: string]: string;
};

const schemaUpdateProduct = z.object({
  // photo: z.unknown().transform((value) => value as FileList | undefined),
  name: z.string().min(3, "o mínimo para o nome do produto é 3 caracteres"),
  quantity: z
    .number()
    .transform((value) => {
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    })
    .default(0),
  price: z
    .string()
    .min(1, "Você deve colocar um valor acima de R$ 0,00")
    .max(7, "O máximo é 9999.99"),
  description: z.string(),
  categories: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .optional(),
  topics: z.array(
    z.object({
      id: z.string().nullable(),
      name: z.string(),
      topicOptions: z.array(
        z.object({
          id: z.string().nullable(),
          name: z.string(),
          price: z.string(),
        })
      ),
    })
  ),
});

type UpdateProductProps = z.infer<typeof schemaUpdateProduct>;

const useProduct = (productId: string) => {
  const searchParams = useSearchParams();
  const model: boolean = !!(searchParams.get("model") === "update");

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["products", productId],
    queryFn: async () => {
      return (await api.get(`/products/${productId}`)).data;
    },
  });

  const form = useForm<UpdateProductProps>({
    resolver: zodResolver(schemaUpdateProduct),
  });

  const { push } = useRouter();

  const updateProduct = async (data: UpdateProductProps) => {
    try {
      const { name, description, quantity, price, topics } = data;

      const newData = {
        name,
        description,
        quantity: Number(quantity || 0),
        price: price ? Number(price) : 0,
        productTopics: topics,
      };

      const response = api.put(`/products/${productId}`, newData);

      await Promise.all([
        queryClient.setQueryData(["products", productId], () => ({
          ...newData,
        })),
        queryClient.setQueryData(["products"], (prev: any) => {
          if (!prev) return [newData];

          return prev?.map((product: any) =>
            product.id === productId ? newData : product
          );
        }),
      ]);

      await toast.promise(response, {
        pending: "Atualizado...",
        success: "Atualizado com sucesso!",
      });
    } catch (error) {
      toast.error("Houve um erro ao tentar atualizar os dados!");
    } finally {
      push("?");
    }
  };

  // This function is used to reset the default values
  // (coming from the backend) of the inputs
  const resetValuesToDefault = () => {
    if (!product) return;

    form.reset({
      name: product.name,
      price: product.price,
      description: product.description,
      quantity: product?.quantity,
      categories: product?.categories,
      topics:
        product?.productTopics?.map((topic) => ({
          id: topic.id,
          name: topic.name,
          topicOptions: topic.topicOptions.map((option) => ({
            id: option.id,
            name: option.name,
            price: String(option.price),
          })),
        })) || [],
    });
  };

  // When starting the page, set the values to default
  React.useEffect(() => {
    resetValuesToDefault();
  }, [product, model]);

  return {
    product,
    model,
    isLoading,
    updateProduct,
    form,
  };
};

export default function ProductUpdate() {
  const params: ParamProps = useParams();
  const productId: string | null = params.productId || null;
  // const { data: categories } = useCategories().getCategories();

  if (!productId) {
    throw new Error(
      "Houve um erro ao tentar encontrar o id do produto solicitado!"
    );
  }

  const { product, form, isLoading, updateProduct, model } =
    useProduct(productId);
  const { register, handleSubmit, formState, control } = form;
  const imagePreview = getImageProduct(product?.photo);

  const {
    append: addNewTopic,
    remove: removeTopic,
    fields: topics,
  } = useFieldArray({
    control,
    name: "topics",
    keyName: "key",
  });

  // const {
  //   fields: categoriesInSchema,
  //   append: addCategory,
  //   remove: removeCategory,
  // } = useFieldArray({
  //   control,
  //   name: "categories",
  //   keyName: "key",
  // });

  if (isLoading || !model) return;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0 } }}
      transition={{ duration: 0.5, type: "spring" }}
      className="fixed top-0 left-0 z-50 shadow-xl overflow-auto p-10
      bg-zinc-900 w-full h-screen flex bg-opacity-50 dark:shadow-black"
    >
      <FormProvider {...form}>
        <motion.form
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          exit={{ y: -50 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-full max-w-[45rem] h-auto m-auto shadow-2xl
        rounded-2xl flex flex-col gap-3 bg-gray-50 dark:bg-zinc-800
        border border-transparent dark:border-zinc-700"
          onSubmit={handleSubmit(updateProduct)}
        >
          <header className="w-full p-y flex justify-between items-center p-[1rem]">
            <h1 className="font-semibold text-orange-600 text-lg">
              Editar produto {product?.name}
            </h1>

            <Link
              href={"?"}
              className="p-3 bg-white shadow rounded-full dark:bg-zinc-700 
            hover:opacity-100 opacity-90 hover:shadow-xl"
            >
              <IoClose />
            </Link>
          </header>

          <section className="flex flex-col w-full gap-3 mt-2 p-[1.5rem]">
            <label htmlFor="photo" className="flex gap-1 w-full">
              <div
                className="w-[10rem] h-[10rem] bg-zinc-100 
              rounded relative overflow-auto
              dark:bg-zinc-700"
              >
                {imagePreview && (
                  <Image
                    quality={25}
                    alt="imagem do produto"
                    src={imagePreview}
                    style={{ objectFit: "cover" }}
                    layout="fill"
                    sizes="(max-width: 768px) 2rem,
                (max-width: 1200px) 2rem,
                33vw"
                  />
                )}
              </div>

              {/* <div className="flex flex-col gap-2 flex-1">
              <span
              className="flex items-center w-full gap-2 font-semibold 
              text-gray-500 text-md dark:text-gray-300"
              >
              <IoMdPhotos size={17} />
              Foto
              </span>
              <input
              {...register("photo")}
              type="file"
              className="p-2 transparent border-2 border-transparent 
              rounded-md outline-none focus:border-orange-500 bg-white
              dark:bg-zinc-700 dark:bg-opacity-40 dark:placeholder:text-gray-500"
              />
              {formState?.errors?.photo && (
                <div className="font-semibold text-red-500">
                {formState?.errors?.name?.message}
                </div>
                )}
                </div> */}
            </label>

            <label htmlFor="name" className="flex flex-col gap-1">
              <span
                className="flex items-center w-full gap-2 font-semibold 
              text-gray-500 text-md dark:text-gray-300"
              >
                <MdDriveFileRenameOutline size={17} />
                Nome
              </span>
              <input
                {...register("name")}
                type="text"
                placeholder="Produto01"
                className="p-2 transparent border-2 border-transparent 
              rounded-md outline-none focus:border-orange-500 bg-white shadow
              dark:bg-zinc-700 dark:bg-opacity-40 dark:placeholder:text-gray-500"
              />
              {formState?.errors?.name && (
                <div className="font-semibold text-red-500">
                  {formState?.errors?.name?.message}
                </div>
              )}
            </label>

            <label htmlFor="name" className="flex flex-col gap-1">
              <span
                className="flex items-center w-full gap-2 font-semibold 
                  text-gray-500 text-md dark:text-gray-300"
              >
                <IoMdPricetag size={17} />
                Preço
              </span>
              <input
                {...register("price")}
                maxLength={7}
                type="text"
                placeholder="19.90"
                className="p-2 transparent border-2 border-transparent bg-white shadow
              rounded-md outline-none resize-none focus:border-orange-500 
              dark:bg-zinc-700 dark:bg-opacity-40 dark:placeholder:text-gray-500"
              />
              {formState?.errors?.price && (
                <div className="font-semibold text-red-500">
                  {formState?.errors?.price?.message}
                </div>
              )}
            </label>

            <label htmlFor="quantity" className="flex flex-col gap-1">
              <span
                className="flex items-center w-full gap-2 font-semibold 
              text-gray-500 text-md dark:text-gray-300"
              >
                <VscListFlat size={17} />
                Quantidade
              </span>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => {
                  const classStyle =
                    field?.value > 0
                      ? "bg-green-100 text-emerald-600 dark:bg-emerald dark:text-white"
                      : "bg-red-100 text-red-600";
                  return (
                    <div className="flex gap-2 items-center">
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange(Math.max(0, (field.value || 0) - 1))
                        }
                        className="w-8 h-8 bg-white border
                      rounded-md grid place-items-center
                      dark:bg-zinc-700 dark:border-gray-700"
                      >
                        <BiMinus />
                      </button>
                      <span
                        className={`w-10 h-10 rounded-md grid font-semibold
                        place-items-center text-lg dark:bg-green-600
                        dark:text-green-800 ${classStyle}`}
                      >
                        {field?.value}
                      </span>
                      <button
                        type="button"
                        onClick={() => field.onChange((field.value || 0) + 1)}
                        className="w-8 h-8 bg-white border
                        rounded-md grid place-items-center
                        dark:bg-zinc-700 dark:border-gray-700"
                      >
                        <PiPlus />
                      </button>
                    </div>
                  );
                }}
              />
              {formState?.errors?.quantity && (
                <div className="font-semibold text-red-500">
                  {formState?.errors?.quantity?.message}
                </div>
              )}
            </label>

            <label htmlFor="name" className="flex flex-col gap-1">
              <span
                className="flex items-center w-full gap-2 font-semibold 
              text-gray-500 text-md dark:text-gray-300"
              >
                <VscListFlat size={17} />
                Descrição
              </span>
              <textarea
                {...register("description")}
                placeholder="Produto01"
                className="transparent outline-none resize-none
              p-2 rounded-md border-2 border-transparent bg-white shadow
              focus:border-orange-500 h-[10rem] dark:bg-zinc-700
              dark:bg-opacity-40 dark:placeholder:text-gray-500"
              />
            </label>
          </section>

          <section
            className="flex flex-col gap-3
          dark:border-zinc-700 border-t mt-5 relative"
          >
            <div className="absolute top-0 left-[1.5rem] translate-y-[-50%]">
              <span className="rounded-md bg-gray-700 text-white p-1 px-2 text-sm">
                Categorias
              </span>
            </div>

            {/* <div className="flex p-6 gap-2">
            {categories?.map((category: Category, indexCategory: number) => {
              const selectedCategory =
              categoriesInSchema.filter(
                (current) => current.id === category.id
                )[0]?.id || null;
                
                const styleClassName = selectedCategory
                ? `bg-orange-600 text-white`
                : `bg-white dark:bg-zinc-700`;
                
                return (
                  <button
                  key={indexCategory}
                  type="button"
                  className={`p-1 px-4 border rounded-md text-lg
                  font-semibold opacity-90 hover:opacity-100
                  ${styleClassName}`}
                  onClick={() => {
                    if (!selectedCategory) {
                      addCategory(category);
                      } else removeCategory(indexCategory);
                      }}
                      >
                      {category.name}
                      </button>
                      );
                      })}
                      </div> */}
          </section>

          <section
            className="flex flex-col gap-3
          dark:border-zinc-700 border-t mt-5 relative"
          >
            <div className="absolute top-0 left-[1.5rem] translate-y-[-50%]">
              <span className="rounded-md bg-gray-700 text-white p-1 px-2 text-sm">
                Tópicos
              </span>
            </div>

            <div className="flex flex-col p-6 gap-2">
              {topics?.map((topic, indexOfTopic: number) => {
                return (
                  <section
                    key={topic.id}
                    className="flex flex-col gap-2 w-auto "
                  >
                    <header className="flex justify-between w-auto items-center gap-2">
                      <Controller
                        name={`topics.${indexOfTopic}.name`}
                        defaultValue={topic.name}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            className="font-semibold text-xl text-gray-600 dark:text-gray-200 bg-transparent rounded-lg flex-1
                            outline-none focus:border-orange-500 placeholder:font-normal"
                            placeholder="Que tal molho extra?"
                          />
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          removeTopic(indexOfTopic);
                        }}
                        className="justify-center flex items-center gap-2 text-sm bg-rose-500 rounded-md 
                        hover:shadow-xl w-auto px-2 h-8 opacity-90 hover:opacity-100 text-white"
                      >
                        <BiMinus />
                        Remover
                      </button>
                    </header>

                    <OptionComponent nestIndex={indexOfTopic} />
                  </section>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  addNewTopic({
                    id: null,
                    name: "",
                    topicOptions: [],
                  })
                }
                className="w-auto border-2 border-dashed p-3 text-gray-600 text-lg bg-white dark:bg-zinc-800
                rounded-xl mt-5 font-semibold flex items-center gap-4 justify-center opacity-80
                hover:opacity-100 hover:border-gray-300 dark:border-zinc-600 dark:text-gray-300"
              >
                <PiPlus />
                Criar um novo tópico
              </button>
            </div>
          </section>

          <footer
            className="flex p-[1rem] border-t gap-3 justify-between
          dark:border-gray-600"
          >
            <button
              type="submit"
              className="p-2 px-5 text-white
              rounded-md opacity-95 hover:opacity-100 
              bg-red-600 hover:shadow-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="p-2 px-5 text-white
              rounded-md opacity-95 hover:opacity-100 
              bg-gray-700 hover:shadow-xl"
            >
              Atualizar
            </button>
          </footer>
        </motion.form>
      </FormProvider>
    </motion.div>
  );
}
