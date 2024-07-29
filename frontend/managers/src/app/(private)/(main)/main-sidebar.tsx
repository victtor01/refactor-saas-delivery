"use client";

import { api } from "@/api";
import { fontOpenSans } from "@/fonts";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BiSolidCrown } from "react-icons/bi";
import { IoMdSettings } from "react-icons/io";
import { useStore } from "@/hooks/useStore";
import { FaCartShopping } from "react-icons/fa6";
import { usePathname, useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import { Link as LinkTransition } from "next-view-transitions";
import { TbTruckDelivery } from "react-icons/tb";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

const secound = 1000;
const minute = secound * 60;

interface PropsInformations {
  email: string;
  firstName: string;
}

const links = {
  home: { link: "/home", icon: FaHome },
  products: { link: "/products", icon: FaCartShopping },
  orders: { link: "/orders", icon: TbTruckDelivery },
};

const StatusStore = () => {
  const { store } = useStore().useCookies();

  return (
    <div className="w-full p-2 py-5 opacity-90 hover:opacity-100 cursor-default">
      <section className="flex flex-col bg-zinc-200 dark:bg-zinc-900 bg-opacity-40 rounded shadow-3d-dark p-4 gap-4 border-orange-500">
        <header className="flex gap-2 overflow-hidden items-center">
          <div className="min-w-10 h-10 bg-zinc-700 rounded-full"></div>
          <div className="py-1 flex flex-col w-full overflow-hidden">
            <span className="dark:text-white text-gray-700 capitalize font-semibold">
              {store?.name}
            </span>
            <p className="overflow-hidden whitespace-nowrap text-ellipsis text-xs text-gray-500 dark:text-gray-300">
              {store?.description || "No description"}
            </p>
          </div>
        </header>

        <section className="flex">
          <button
            className="hover:opacity-100 bg-emerald-600
            rounded px-3 p-1 text-md text-white"
          >
            Aberto
          </button>
        </section>
      </section>
    </div>
  );
};

const Divider = () => (
  <div className="flex w-full h-1 dark:bg-zinc-700 bg-opacity-50 bg-gray-300"></div>
);

const useMainSidebar = () => {
  const { data } = useQuery({
    queryKey: ["manager-informations"],
    queryFn: async (): Promise<PropsInformations> =>
      (await api.get("/managers/my-informations")).data,
    refetchInterval: minute * 60, // one hour
  });

  const { store } = useStore().useCookies();

  return {
    data,
    store,
  };
};

const MainSidebar = () => {
  const { data, store } = useMainSidebar();
  const { push: redirect } = useRouter();
  const pathName = usePathname();

  return (
    <section
      className="w-full max-w-[15rem] h-full border-r bg-white flex
      dark:bg-zinc-800 dark:border-zinc-700 dark:bg-opacity-60 
      dark:border-opacity-60 z-30 overflow-auto"
    >
      <div className="flex flex-col w-full">
        <section className="flex-1 flex flex-col">
          <button
            type="button"
            onClick={() => redirect("/select-store")}
            className="text-gray-600 font-semibold text-md w-auto
            capitalize dark:text-orange-600 px-5 backdrop-blur-xl m-3 flex
            bg-purple-50 rounded-md p-2 shadow-inner hover:shadow-xl dark:shadow-black
            hover:bg-purple-100 transition-all dark:bg-zinc-700 dark:bg-opacity-50"
          >
            <span className={fontOpenSans}>{store?.name}.</span>
          </button>

          <Divider />

          <StatusStore />

          <Divider />

          <div className="w-full flex flex-col gap-1 p-3">
            {Object.entries(links).map(([name, { link, icon: Icon }]) => {
              const selectedLink = pathName.includes(link);
              const styleSelected = selectedLink
                ? "bg-zinc-100 dark:bg-zinc-700 dark:bg-opacity-30 cursor-default pointer-events-none"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:bg-opacity-70 dark:hover:bg-opacity-30";
              const color = selectedLink
                ? "text-rose-600"
                : "dark:text-gray-500";

              return (
                <Link
                  key={name}
                  href={link}
                  className={`w-full flex items-center gap-5 font-semibold relative
                  text-md rounded transition-all capitalize p-3 pl-7 ${styleSelected}`}
                >
                  <AnimatePresence>
                    {selectedLink && (
                      <motion.span
                        className="flex bg-rose-600 absolute w-1 rounded-full left-0"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "50%", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>

                  <div
                    className={`h-full grid place-items-center transition-colors ${color}`}
                  >
                    <Icon size={21} />
                  </div>
                  <div className={`text-md transition-colors ${color}`}>
                    {name}
                  </div>
                </Link>
              );
            })}
          </div>
          <Divider />
        </section>

        <footer
          className="p-2 border-t bg-gray-50 dark:bg-zinc-800 flex 
        justify-between items-center opacity-95 hover:opacity-100
        dark:border-zinc-700"
        >
          <div className="flex items-center gap-1 w-full">
            <div
              className="w-9 h-9 bg-gradient-45 from-rose-500 
              to-orange-500 rounded-[100%]"
            ></div>

            <div className="font-semibold flex-col flex gap-1 flex-1">
              <div
                className={`${fontOpenSans} dark:text-gray-200
              text-gray-700 capitalize text-md px-2 p-1`}
              >
                {data?.firstName}
              </div>
            </div>

            <LinkTransition
              href={"/config"}
              className="p-1 rounded-xl w-9 bg-gray-200 text-gray-800
              h-9 grid place-items-center dark:bg-zinc-700 dark:text-gray-400"
            >
              <IoMdSettings />
            </LinkTransition>
            <Link
              href={"#"}
              className="p-1 text-white rounded-xl
            bg-gradient-45 from-rose-600 to-orange-500 w-9
            h-9 grid place-items-center shadow-lg hover:shadow-rose-300"
            >
              <BiSolidCrown />
            </Link>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { MainSidebar };
