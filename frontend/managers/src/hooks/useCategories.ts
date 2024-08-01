'use client';

import { api } from "@/api";
import { Category } from "@/interfaces/category";
import { useQuery } from "@tanstack/react-query";

function useCategories() {

  const getCategories = () => {
    const { data } = useQuery<Category[]>({
      queryKey: ["categories"],
      queryFn: async () => (await api.get("/products/categories/mine")).data,
    });

    return { data }
  };

  return {
    getCategories,
  };
};

export { useCategories };
