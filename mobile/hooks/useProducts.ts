import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function useProducts() {
  const api = useApi();

  const result = useQuery({
    queryKey: ["Products"],
    queryFn: async () => {
      const { data } = await api.get("/products");
      const productsData = data.data as Product[];

      return productsData;
    },
  });

  return result;
}
