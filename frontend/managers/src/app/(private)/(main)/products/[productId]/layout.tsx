import { fontInter } from "@/fonts";
import { IoArrowBack } from "react-icons/io5";
import Link from "next/link";
import ProductUpdate from "./product-update";
import { Suspense } from "react";
import Loading from "./loading";

interface LayoutProps {
  children: React.ReactNode;
  params: {
    productId: string;
  };
}

export default function Template({ children }: LayoutProps) {
  return (
    <>
      <ProductUpdate />

      <header
        className="flex items-center justify-between w-full p-2 bg-white border-b
        dark:bg-zinc-800 dark:border-zinc-700"
      >
        <Link
          href="/products"
          className={`flex items-center gap-2 p-1 px-3 dark:hover:bg-zinc-700 
          font-semibold text-orange-500 rounded hover:bg-gray-100
          ${fontInter}`}
        >
          <IoArrowBack size={18} />
          Produtos
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={"?model=update"}
            className="p-1 px-2 text-gray-500 rounded-md border
            hover:shadow-xl opacity-95 hover:opacity-100
            dark:text-gray-300 dark:border-zinc-600"
          >
            Editar
          </Link>
          <Link
            href={"?model=delete"}
            className="p-1 px-2 text-white rounded-md bg-rose-500
             hover:shadow-xl opacity-95 hover:opacity-100"
          >
            Deletar
          </Link>
        </div>
      </header>

      <section className="w-full h-auto p-10">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </section>
    </>
  );
}
