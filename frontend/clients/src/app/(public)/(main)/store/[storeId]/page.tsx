"use client";

import { api } from "@/app/api";
import { fontInter, fontOpenSans } from "@/app/fonts";
import { Product } from "@/entities/product";
import { Store } from "@/entities/store";
import { getImageProduct } from "@/hooks/get-image-product";
import { useCartStore } from "@/states/cart-store";
import { formatToBRL } from "@/utils/format-to-brl";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect } from "react";
import { BiCart, BiPlus } from "react-icons/bi";
import { BsArrowRight, BsCart } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { getCartInLocalstorage } from "@/utils/cart-localstorage";
import Link from "next/link";
import { ProductAdd } from "./productAdd";
import { ButtonCartToOpenModal } from "@/components/button-cart-to-open-modal";
import { OrderModal } from "@/components/order-modal";

interface Params {
  params: {
    storeId: string;
  };
}

function useStore(storeId: string) {
  const [cart] = useCartStore((state) => [state.cart, state.addToCart]);

  const search = useSearchParams();
  const productIdToAdd = search.get("productAdd");
  const modalVisible = !!(search.get("model") === "cart");

  const { data: store } = useQuery<Store>({
    queryKey: ["product", storeId],
    queryFn: async () => {
      if (!storeId) return null;
      return (await api.get(`/stores/${storeId}`)).data || null;
    },
    refetchInterval: 1000 * 5,
  });

  const router = useRouter();

  // const finalizeOrder = async () => router.push("/order");

  // const totalPrice = productsInCart?.reduce((acc, product) => {
  //   return (acc += Number(product.price) || 0);
  // }, 0);

  // const addOneProductInCart = (product: Product) => {
  //   setProductsInCart([product]);
  //   toast.success("Atualizado com sucesso!", {
  //     toastId: "toast-sucess-product",
  //   });
  // };

  // const addProductInCart = (product: Product) => {
  //   const productsInCartJSON = getCartInLocalstorage() || [];
  //   const productsToAdd = [...productsInCartJSON, product];
  //   setProductsInCart(productsToAdd);
  //   toast.success("Atualizado com sucesso!", {
  //     toastId: "toast-sucess-product",
  //   });
  // };

  // const removeProductInCart = (product: Product) => {
  //   removeProductsInCart(product.id);
  //   toast.warn("Produto retirado do carrinho", {
  //     icon: <BiCart size={20} />,
  //     toastId: "toast-warn-product",
  //   });
  // };

  // const AddOrRemoveProductInCart = (product: Product) => {
  //   const productsInCartJSON = getCartInLocalstorage() || [];
  //   if (productsInCartJSON.length > 0) {
  //     const isProductInCart = productsInCartJSON.some(
  //       (item) => item.id === product.id
  //     );
  //     isProductInCart
  //       ? removeProductInCart(product)
  //       : addProductInCart(product);
  //   } else {
  //     addOneProductInCart(product);
  //   }
  // };

  // useEffect(() => {
  //   setProductsInLocalhost(productsInCart);
  // }, [productsInCart]);

  return {
    store,
    modalVisible,
    productsInCart: null,
    productIdToAdd,
  };
}

export default function ({ params }: Params) {
  if (!params.storeId) return;

  const { store, productIdToAdd, modalVisible, productsInCart } = useStore(
    params.storeId
  );

  return (
    <>
      <section className="w-full">
        <section className="w-full max-w-main mx-auto p-4 gap-3 flex flex-col min-h-[100vh]">
          <header className="text-xl font-semibold text-gray-600 flex gap-3 items-center rounded p-2">
            <BsCart /> Cardápio
          </header>

          <div className="flex w-full gap-4 h-auto relative items-start">
            <div className={`w-full flex gap-10 flex-wrap ${fontInter}`}>
              {store?.products?.map((product: Product) => {
                const image = getImageProduct(product?.photo);

                return (
                  <div
                    key={product.id}
                    style={{
                      opacity: product.quantity === 0 ? 0.5 : 1,
                      pointerEvents: product.quantity === 0 ? "none" : "all",
                    }}
                    className="w-full max-w-[18rem] bg-white shadow rounded-lg relative hover:shadow-xl
                flex flex-col"
                  >
                    <div
                      className="w-full h-[10rem] bg-gradient-45 from-orange-500 to-rose-600
                    rounded-t-lg overflow-hidden relative"
                    >
                      {image && (
                        <Image
                          quality={20}
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

                    <div className="p-3 capitalize h-auto flex flex-col flex-1">
                      <div className="flex w-full justify-between">
                        <span className="font-semibold text-gray-600">
                          {product?.name}
                        </span>
                        <span className="p-1 px-2 text-xs bg-green-100 rounded text-green-800">
                          R$ {product.price}
                        </span>
                      </div>
                      <div className="font-normal text-gray-400 max-h-[3rem] flex-1 rounded overflow-auto text-sm">
                        {product?.description || "Sem descrição"}
                      </div>
                    </div>

                    <footer className="p-2 pt-0">
                      <Link
                        href={`?productAdd=${product.id}`}
                        className={`p-2 px-4 text-white rounded capitalize flex items-center gap-2
                        opacity-95 hover:opacity-100 hover:shadow-xl font-light text-sm justify-center
                      bg-rose-600`}
                      >
                        <BiPlus />
                        Pedido
                      </Link>
                    </footer>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <ButtonCartToOpenModal />
      </section>

      <AnimatePresence>{modalVisible && <OrderModal />}</AnimatePresence>
      
      <AnimatePresence>
        {productIdToAdd && <ProductAdd productId={productIdToAdd} />}
      </AnimatePresence>

    </>
  );
}
