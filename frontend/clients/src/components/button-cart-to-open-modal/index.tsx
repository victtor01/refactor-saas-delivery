"use client";

import { useCartStore } from "@/states/cart-store";
import Link from "next/link";
import { MdOutlineLocalGroceryStore } from "react-icons/md";

const useButtonCartToOpenModal = () => {
  const [cart] = useCartStore((state) => [state.cart]);

  return {
    cart,
  };
};

const ButtonCartToOpenModal = () => {
  const { cart } = useButtonCartToOpenModal();

  return (
    <div className="flex bottom-0 fixed w-[99%] pointer-events-none">
      <div className="max-w-main w-full mx-auto flex justify-end p-5">
        <Link
          href={"?model=cart"}
          className="p-4 bg-rose-600 opacity-95 hover:opacity-100 text-white relative rounded-full
          hover:translate-y-[-0.2rem] transition-all hover:shadow-xl pointer-events-auto"
        >
          <span
            className="absolute top-0 right-0 w-6 h-6 bg-rose-600 border-2
            border-white grid place-items-center rounded-full text-white
            translate-x-[30%] translate-y-[-30%] text-sm"
          >
            {cart?.length || 0}
          </span>
          <MdOutlineLocalGroceryStore size="20" />
        </Link>
      </div>
    </div>
  );
};

export { ButtonCartToOpenModal };
