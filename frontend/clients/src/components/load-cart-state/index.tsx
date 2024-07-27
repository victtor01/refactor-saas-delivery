"use client";

import { Product } from "@/entities/product";
import { useCartStore } from "@/states/cart-store";
import { useEffect } from "react";

export const LoadCartState = ({ children }: { children: React.ReactNode }) => {
  const [setCart] = useCartStore((state) => [state.updateManyCart]);

  useEffect(() => {
    const cartStringfy = !!localStorage?.getItem("cart")
      ? localStorage?.getItem("cart")
      : null;

    if(cartStringfy === 'undefined' || !cartStringfy) return;

    const cartJSON = JSON.parse(cartStringfy);
    
    if (!cartStringfy || !cartJSON?.[0]) return;
    
    setCart(cartJSON)
  }, []);

  return children
};
