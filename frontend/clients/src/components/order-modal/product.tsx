"use client";

import { Product } from "@/entities/product";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
// import { ProductsTopics } from "./productsTopic";
import { Order_Product, useCartStore } from "@/states/cart-store";
import { formatToBRL } from "@/utils/format-to-brl";
import { BiMinus, BiPlus } from "react-icons/bi";
import { queryClient } from "@/providers/react-query-provider";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { SchemaOrderData } from ".";

type ProductOrderModelProps = {
  orderProduct: Order_Product;
  index: number;
};

const useProductOrderModel = (order_product: Order_Product) => {
  // const [removeToCart] = useCartStore((state) => [state.removeToCart]);
  const formContext = useFormContext<SchemaOrderData>();

  const remove = () => {
    const cartStringfy = localStorage.getItem("cart") || null;
    const cartJSON: Product[] | null = cartStringfy
      ? JSON.parse(cartStringfy)
      : null;

    if (!cartStringfy || !cartJSON?.[0]?.id) return;

    const newItems = cartJSON.filter(
      (productCurrent) => productCurrent.id !== order_product.product.id
    );

    queryClient.setQueryData(["cart"], (prevData: Product[]) => [
      ...prevData.filter((curr) => curr.id !== order_product.product.id),
    ]);

    // removeToCart(product.id);

    localStorage.setItem("cart", JSON.stringify(newItems));
  };

  return {
    formContext,
    remove,
  };
};

const ProductOrderModel = ({ orderProduct, index }: ProductOrderModelProps) => {
  const { formContext, remove } = useProductOrderModel(orderProduct);

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 * (index + 1) }}
      className="w-full p-3 bg-white rounded hover:shadow opacity-95 hover:opacity-100 gap-2 flex flex-col relative"
    >
      <div className="font-semibold text-gray-600 flex justify-between items-center text-xl">
        <span className="flex-[2]">{orderProduct.product.name}</span>
        <div className="flex-1">
          <span className="text-green-700 text-lg bg-emerald-50 rounded-md p-1 px-2">
            {formatToBRL(Number(orderProduct.product.price))}
          </span>
        </div>
        <button
          type="button"
          onClick={remove}
          className="w-8 h-8 bg-gray-50 rounded grid place-items-center hover:shadow
          hover:bg-rose-600 hover:text-white"
        >
          <IoClose />
        </button>
      </div>

      {orderProduct?.options?.length > 0 && (
        <div className="flex flex-col border-l-4 pl-2">
          {orderProduct?.options?.map((orderProduct, index: number) => (
            <div className="font-semibold text-gray-500">
              {orderProduct.name}
            </div>
          ))}
        </div>
      )}

      <footer className="flex gap-2 items-center border-t pt-2">
        <Controller
          control={formContext.control}
          name={`${index}.quantity`}
          render={({ field }) => (
            <>
              <button
                type="button"
                className="w-8 h-8 bg-gray-50 border text-gray-500 rounded grid place-items-center"
              >
                <BiMinus />
              </button>
              <span className="w-8 h-8 text-gray-700 rounded-lg grid place-items-center">
                {JSON.stringify(field.value)}
              </span>
              <button
                onClick={() => field.onChange((prev: number) => prev + 1)}
                type="button"
                className="w-8 h-8 bg-orange-600 text-white shadow rounded grid place-items-center"
              >
                <BiPlus />
              </button>
            </>
          )}
        />
      </footer>
    </motion.div>
  );
};

export { ProductOrderModel };
