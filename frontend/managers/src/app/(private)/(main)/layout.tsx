import { cookies } from "next/headers";
import { MainSidebar } from "./main-sidebar";
import { redirect } from "next/navigation";
import { Bounce, ToastContainer } from "react-toastify";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const selectedStoreId = cookies().get("_store")?.value || null;
  const theme = cookies().get("_theme")?.value || "light";

  if (!selectedStoreId) redirect("/select-store");

  return (
    <main
      className="bg-gray-100 bg-opacity-50 dark:bg-zinc-900 w-full h-screen 
      overflow-auto flex dark:bg-opacity-60 dark:from-zinc-900 dark:to-zinc-900"
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        transition={Bounce}
      />

      <MainSidebar />
      
      <section className="flex-col flex flex-1 overflow-auto">
        {children}
      </section>
    </main>
  );
}
