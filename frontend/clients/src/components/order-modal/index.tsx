/**
 * THIS COMPONENT CAN BE USED IN THE
 * FUTURE TO FINALIZE ORDERS!!!
 */

"use client";

import { fontInter } from "@/app/fonts";
import { Product } from "@/entities/product";
import { useCartStore } from "@/states/cart-store";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { BsArrowRight } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { ProductOrderModel } from "./product";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/api";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type SchemaOrderData = z.infer<typeof schemaOrder>;

const schemaOrder = z.array(
  z.object({
    product: z.object({
      id: z.string(),
      name: z.string(),
    }),
    options: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          price: z.number(),
        })
      )
      .nullable(),
    quantity: z.number(),
  })
);

const useOrderModel = () => {
  const [cart] = useCartStore((state) => [state.cart, state.addToCart]);

  const form = useForm<SchemaOrderData>({
    resolver: zodResolver(schemaOrder),
  });

  const products = cart.map((cart) => cart.product);

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["cart"],
    queryFn: async () =>
      (
        await api.post("/products/findByIds", {
          productIds: products?.map((product) => product.id),
          storeId: products[0]?.storeId,
        })
      ).data,
  });

  const resetValuesInForm = () =>
    form.reset([
      ...cart?.map((cart) => {
        return {
          quantity: cart.quantity,
          product: cart.product,
          options: [...cart.options.map(option => ({
            id: option.id,
            name: option.name
          }))],
        };
      }),
    ]);

  useEffect(() => {
    resetValuesInForm();
  }, [cart]);

  return {
    cart,
    isLoading,
    data,
    form,
  };
};

const MainContainer = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="fixed w-full h-screen top-0 overflow-auto overflow-x-hidden bg-black bg-opacity-50
    justify-end flex z-30"
  >
    <motion.div
      className="w-full max-w-[30rem] bg-gray-100 h-screen overflow-auto right-0 shadow-xl shadow-black-400
      flex flex-col relative "
      initial={{ x: 1000 }}
      animate={{ x: 0 }}
      exit={{ x: 1000 }}
      transition={{ type: "linear" }}
    >
      {children}
    </motion.div>
  </motion.div>
);

const OrderModal = () => {
  const { form, ...props } = useOrderModel();
  const { data, isLoading } = props;

  if (isLoading) {
    return (
      <MainContainer>
        <div className="w-auto m-3">Carregando...</div>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <FormProvider {...form}>
        <header className="w-full p-3 px-5 pb-5 flex flex-col justify-between bg-white border-b">
          <div className="w-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-700">
              Informações do pedido!
            </h1>

            <Link
              href={"?"}
              className="w-10 h-10 grid place-items-center bg-white shadow rounded-full"
            >
              <IoClose />
            </Link>
          </div>
          <p className="text-gray-400 font-sm w-[70%]">
            Note que você só deve fazer um pedido por loja!
          </p>
        </header>

        <section className="flex flex-1 flex-col py-1 gap-2">
          {!data?.length && (
            <div className="p-2 font-semibold text-gray-600">
              Nenhum produto no seu pedido!
            </div>
          )}

          {props.cart?.map((order_product, index: number) => {
            return (
              <ProductOrderModel key={index} index={index} orderProduct={order_product}  />
            );
          })}
        </section>

        <footer className="flex flex-col gap-4 p-4 w-full bg-white border rounded-t-lg">
          <div className={`w-full flex flex-col gap-2 text-lg ${fontInter}`}>
            <div className="flex gap-3 items-center">
              <span className="text-gray-500 flex-1">Valor total:</span>
              <div className="font-semibold text-gray-600 px-4 rounded p-1">
                R$ 38,40
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <span className="text-gray-500 flex-1">Quantidade de items:</span>
              <div className="font-semibold text-gray-600 px-4 rounded p-1">
                18
              </div>
            </div>
          </div>

          <button
            className="w-full p-3 bg-gradient-45 from-orange-600 to-red-600 rounded
          text-white opacity-90 hover:opacity-100 flex justify-center items-center gap-4
          hover:gap-6 transition-all"
          >
            Seguir
            <BsArrowRight size={20} />
          </button>
        </footer>
      </FormProvider>
    </MainContainer>
  );
};

export { OrderModal };
