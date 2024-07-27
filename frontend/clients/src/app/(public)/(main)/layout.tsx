import { Header } from "./public-header";
import { PublicNav } from "./public-nav";
import { LoadCartState } from "@/components/load-cart-state";

interface LayoutProps {
  children: React.ReactNode;
}

export default function ({ children }: LayoutProps) {
  return (
    <LoadCartState>
      <div className="w-full h-screen overflow-auto flex flex-col relative">
        <Header />
        <PublicNav />
        {children}
      </div>
    </LoadCartState>
  );
}
