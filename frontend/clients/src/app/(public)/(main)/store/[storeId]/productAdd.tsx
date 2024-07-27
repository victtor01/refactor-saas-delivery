"use client";

import { api } from "@/app/api";
import { getImageProduct } from "@/hooks/get-image-product";
import { useQuery } from "@tanstack/react-query";
import { formatToBRL } from "@/utils/format-to-brl";
import { Product } from "@/entities/product";
import { z } from "zod";

// components

import Link from "next/link";
import Image from "next/image";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { topicOption } from "@/entities/topic-options";
import { BiCheck, BiMinus, BiPlus } from "react-icons/bi";
import { Loader } from "@/components/loader";
import { Background, Container } from "./helpers-product-add";
import { Order_Product, useCartStore } from "@/states/cart-store";
import { useEffect } from "react";

const schemaProducts = z.object({
  options: z.array(
    z.object({
      id: z.string(),
      price: z.number(),
      name: z.string(),
    })
  ),
  quantity: z.number(),
});

type SchemaType = z.infer<typeof schemaProducts>;

const useAddProduct = (productId: string) => {
  const [cart, addToCart] = useCartStore((state) => [
    state.cart,
    state.addToCart,
  ]);

  const form = useForm<SchemaType>({
    resolver: zodResolver(schemaProducts),
    defaultValues: {
      quantity: 1,
    },
  });

  const { data: product, isLoading: loadingProduct } = useQuery<Product>({
    queryKey: ["products", productId],
    refetchInterval: 1000 * 5,
    queryFn: async () => {
      const { data } = await api.get(`/products/findById/${productId}`);
      return data;
    },
  });

  const { append, remove, fields } = useFieldArray({
    control: form.control,
    keyName: "genericId",
    name: "options",
  });

  const addProductInCart = (data: SchemaType) => {
    if (!product) return;

    const { id, name, price, storeId } = product;

    const orderProduct = {
      observation: "",
      options: data.options,
      quantity: data.quantity,
      product: {
        price: Number(price),
        storeId,
        name,
        id,
      },
    } satisfies Order_Product;

    addToCart(orderProduct);
  };

  const addOptionOrRemove = (option: topicOption): void => {
    const { id, price, name } = option;

    const searchProductInSchemaData =
      fields?.filter((field) => field.id === id)[0] || null;

    if (searchProductInSchemaData?.id) {
      const searchIndex = fields?.findIndex((field) => field.id === id);
      remove(searchIndex);
    } else {
      append({
        price: Number(price),
        name,
        id,
      });
    }
  };

  const priceOfOptions =
    fields?.reduce((curr, item) => {
      return Number(item.price) + curr;
    }, 0) || 0;

  const totalPrice = product?.price
    ? Number(product.price) + priceOfOptions
    : 0;

  return {
    form,
    fields,

    utils: {
      totalPrice,
      product,
    },

    states: {
      loadingProduct,
    },

    functions: {
      addProductInCart,
      addOptionOrRemove,
    },
  };
};

function ProductAdd({ productId }: { productId: string }) {
  const {
    form,
    fields,
    states: { loadingProduct },
    utils: { totalPrice, product },
    functions: { addProductInCart, addOptionOrRemove },
  } = useAddProduct(productId);

  const image = product?.photo ? getImageProduct(product?.photo) : null;

  const { control, handleSubmit } = form;

  if (loadingProduct) {
    return (
      <Background>
        <Loader />
      </Background>
    );
  }

  if (!product?.id) {
    return (
      <Container>
        <div className="flex flex-col gap-2 flex-1 justify-center items-center font-semibold text-gray-500 text-lg">
          Nenhum produto Disponível
          <Link href={"?"} className="">
            Voltar
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <header
        className="w-full flex justify-between p-4 px-5 font-semibold 
        text-gray-200 bg-rose-600 shadow top-0 z-20"
      >
        <h1>Adicionar uma novo produto ao pedido...</h1>
        <Link href={"?"}>Fechar</Link>
      </header>

      <form
        className="flex flex-col flex-1 overflow-auto"
        onSubmit={handleSubmit(addProductInCart)}
      >
        <section className="flex flex-col p-5 flex-1">
          <section className="flex flex-col gap-2">
            <div
              className="flex w-full h-[12rem] border-2 border-dashed 
            rounded-xl overflow-hidden relative bg-white "
            >
              {image && (
                <Image
                  quality={100}
                  alt="imagem do produto"
                  src={image}
                  style={{ objectFit: "cover" }}
                  layout="fill"
                  sizes="(max-width: 768px) 2rem,
                  (max-width: 1200px) 2rem,
                  33vw"
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-gray-500 rounded flex items-center cursor-default text-2xl">
                {product?.name}
              </div>

              <div className="font-semibold rounded flex items-center cursor-default text-lg">
                <div className="text-rose-400 bg-rose-50 p-1 px-2 rounded">
                  {formatToBRL(Number(product?.price || 0))}
                </div>
              </div>

              <div className="text-base text-gray-400 items-center flex cursor-default">
                {product?.description || "Sem descrição"}
              </div>
            </div>
          </section>

          <section className="flex gap-4 flex-col mt-4">
            {product?.productTopics?.map((topic) => {
              return (
                <div className="flex flex-col" key={topic.id}>
                  <header className="font-semibold flex p-2 rounded-xl px-4 bg-zinc-100">
                    <h2
                      className="bg-clip-text text-transparent 
                    bg-gradient-to-r from-red-600 to-orange-500 text-lg"
                    >
                      {topic.name}
                    </h2>
                  </header>
                  <div className="border-l-4 ml-4 px-2 border-gray-200 flex flex-col gap-1 p-1">
                    {topic?.topicOptions?.map((option, index) => {
                      const someInFields = fields?.some(
                        (field) => field.id === option.id
                      );

                      const classStyle = someInFields
                        ? `bg-orange-500 text-white`
                        : `bg-gray-200`;

                      return (
                        <div
                          key={index}
                          className="text-lg capitalize text-gray-500 w-full justify-between flex"
                        >
                          <div>{option?.name}</div>
                          <div className="flex items-center gap-2">
                            <div className=" text-green-600 flex items-center px-4 text-sm opacity-80 rounded ">
                              + {formatToBRL(Number(option.price))}
                            </div>
                            <button
                              type="button"
                              className={`w-6 h-6 border rounded-md grid place-items-center
                              ${classStyle}`}
                              onClick={() => addOptionOrRemove(option)}
                            >
                              {someInFields && <BiCheck />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>
        </section>

        <footer className=" bottom-0 w-full p-4 border-t flex justify-between bg-white ">
          <div className="items-center flex gap-3">
            <Controller
              control={control}
              name="quantity"
              render={({ field }) => (
                <>
                  <button
                    className="grid place-items-center rounded-lg text-gray-500"
                    type="button"
                    onClick={() =>
                      field.onChange(
                        field.value > 1 ? field.value - 1 : field.value
                      )
                    }
                  >
                    <BiMinus />
                  </button>
                  <span
                    className="w-6 h-10 grid place-items-center rounded-lg 
                  text-gray-600 font-semibold"
                  >
                    {field.value}
                  </span>
                  <button
                    className="grid place-items-center rounded-lg text-gray-500"
                    type="button"
                    onClick={() =>
                      field.onChange(
                        field.value < product.quantity
                          ? field.value + 1
                          : field.value
                      )
                    }
                  >
                    <BiPlus />
                  </button>
                </>
              )}
            />
          </div>

          <button
            type="submit"
            className="px-6 p-3 bg-gradient-45 justify-between gap-10 flex items-center
            from-rose-100 to-orange-100 rounded-full font-semibold text-orange-600 opacity-90 hover:opacity-100"
          >
            <div>Adicionar</div>
            <span>{formatToBRL(totalPrice)}</span>
          </button>
        </footer>
      </form>
    </Container>
  );
}

export { ProductAdd };
