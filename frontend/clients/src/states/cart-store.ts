import { OrderProducts } from "@/app/(private)/order/order-products";
import { create } from "zustand";

export type Order_Product = {
  observation: string;
  product: Product;
  quantity: number;
  options: Option[];
};

type CartStore = {
  cart: Order_Product[];
  updateManyCart: (cart: Order_Product[]) => void;
  addToCart: (cart: Order_Product) => void;
};

type Product = {
  id: string;
  name: string;
  price: number;
  storeId: string;
};

type Option = {
  id: string;
  name: string;
  price: number;
};

const useCartStore = create<CartStore>((set) => ({
  cart: [],

  updateManyCart: (ordersProducts: Order_Product[]) => {
    set(() => {
      return {
        cart: ordersProducts,
      };
    });
  },

  addToCart: (order_product: Order_Product) => {
    set((cartStore: CartStore) => {
      const { cart } = cartStore;

      const existingProductIndex = cart.findIndex(
        (item) =>
          item.product.id === order_product.product.id &&
          item.observation === order_product.observation &&
          item.options.length === order_product.options.length &&
          item.options.every(
            (opt, index) => opt.id === order_product.options[index].id
          )
      );

      if (existingProductIndex !== -1) {
        const newCart = [...cart];
        newCart[existingProductIndex].quantity += order_product.quantity;
        localStorage.setItem("cart", JSON.stringify(newCart));

        return { cart: newCart };
      } else {
        localStorage.setItem("cart", JSON.stringify([...cart, order_product]));

        return { cart: [...cart, order_product] };
      }
    });
  },
}));

export { useCartStore };

// removeToCart: (productId: string) => {
//   set((prev: CartStore) => {
//     if (prev.products.length === 1)
//       return {
//         products: [],
//       };

//     return {
//       products: [
//         ...prev.products.filter(
//           (productCurrent) => productCurrent.id !== productId
//         ),
//       ],
//     };
//   });
// },
