import { useApi } from "@/lib/api";
import { Cart } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCart() {
  const api = useApi();
  const queryClient = useQueryClient();

  const addProductToCart = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const { data } = await api.post("/cart", {
        productId,
        quantity,
      });
      const cartData: Cart = data.data;
      return cartData;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      }),
  });

  return {
    isAddingToCart: addProductToCart.isPending,
    addToCart: addProductToCart.mutate
  }
}
