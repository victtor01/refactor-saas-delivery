"use client";

import { api } from "@/api";
import { Loader } from "@/components/loader";
import { fontInter, fontOpenSans, fontValela } from "@/fonts";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

interface ResponseAuth {
  logged: boolean;
  error: boolean;
  email: string;
}

const authSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

type AuthData = z.infer<typeof authSchema>;

const useAuth = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthData>({
    resolver: zodResolver(authSchema),
  });

  const auth = async (body: AuthData) => {
    try {
      const response = await api.post<ResponseAuth>("/auth/managers", {
        email: body.email,
        password: body.password,
      });

      const data = response?.data || null;

      await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
        }),
      });
    } catch (err) {
      toast.error("Houve um erro ao tentar fazer o login.");
    }
  };

  return {
    auth,
    form: {
      isSubmitting,
      register,
      handleSubmit,
    },
  };
};

export default function Login() {
  const {
    auth,
    form: { register, handleSubmit, isSubmitting },
  } = useAuth();
  return (
    <>
      <header className="w-full flex justify-between p-10 z-10">
        <div></div>
        <div className="flex gap-3 items-center font-semibold">
          <span className="text-gray-600">Não tem uma conta?</span>
          <Link
            href="/signup"
            className="p-3 px-5 opacity-95 hover:opacity-100 shadow-xl
            rounded-lg bg-gradient-45 from-orange-500 to-rose-500
            text-white"
          >
            Cadastrar-se
          </Link>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(auth)}
        className="flex flex-col p-12 py-14 gap-5 m-auto bg-transparent rounded
        w-full max-w-[28rem] z-10 bg-white shadow shadow-gray-300"
      >
        <header className={`${fontOpenSans} gap-8 flex flex-col items-center`}>
          <h1
            className="text-xl text-gray-600
            dark:text-white font-semibold flex gap-2 items-center"
          >
            <div className="flex w-8 h-8 bg-rose-600 rounded"></div>
            <span className="font-bold text-2xl">MIDELIVERY</span>
          </h1>
          <h2
            className={`font-semibold text-gray-600
          dark:text-gray-300 text-md`}
          >
            Entre com Email e Senha
          </h2>
        </header>
        <section className="flex flex-col gap-4">
          <label htmlFor="email" className="flex flex-col gap-1">
            <span
              className="font-semibold text-sm text-gray-600
            dark:text-gray-300"
            >
              Email
            </span>
            <input
              type="text"
              id="email"
              className="rounded p-2
              bg-transparent outline-none border-2
              dark:border-gray-600 focus:border-rose-500
              dark:focus:border-rose-600 duration-200
              bg-white dark:bg-zinc-800"
              placeholder="example@gmail.com"
              {...register("email")}
            />
          </label>
          <label htmlFor="password" className="flex flex-col gap-1">
            <span
              className="font-semibold text-sm text-gray-600
            dark:text-gray-300"
            >
              Senha
            </span>
            <input
              type="text"
              id="password"
              className="rounded p-2
              bg-transparent outline-none border-2 transition-all
              dark:border-gray-600 focus:border-rose-500
              dark:focus:border-rose-600 duration-200
              bg-white dark:bg-zinc-800"
              placeholder="••••••••••"
              {...register("password")}
            />
          </label>
        </section>
        <footer className="w-full flex">
          <button
            type="submit"
            className="p-3 w-full bg-rose-600
            hover:text-white text-gray-100
            font-semibold hover:opacity-100 rounded opacity-95"
          >
            {isSubmitting && <Loader />}
            {!isSubmitting && "Entrar"}
          </button>
        </footer>

        <div>
          <label htmlFor="logged" className="flex gap-2 ">
            <Link
              href={"#"}
              className="text-gray-500 font-semibold dark:text-gray-200"
            >
              Esqueci minha senha
            </Link>
          </label>
        </div>
      </form>
    </>
  );
}

/* <div className="fixed top-0 left-0">
    <div
      className="w-[80vh] h-[80vh] bg-gray-100 bg-opacity-20 rounded-[30%]
    translate-x-[-40%] translate-y-[-40%] rotate-[23deg] dark:bg-zinc-800 dark:bg-opacity-50 border
    dark:border-gray-800"
    ></div>
  </div>
  <div className="fixed bottom-0 right-0">
    <div
      className="w-[80vh] h-[80vh] bg-gray-100 bg-opacity-30 rounded-[30%]
    translate-x-[40%] translate-y-[40%] rotate-[23deg] dark:bg-zinc-800 dark:bg-opacity-20 border
    dark:border-gray-800"
    ></div>
  </div> 
*/
