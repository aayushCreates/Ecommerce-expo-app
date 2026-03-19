import { useApi } from "@/lib/api";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";

export default function useOrders() {
  const api = useApi();

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/orders/my-orders");
      return data.data as Order[];
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
  };
}
