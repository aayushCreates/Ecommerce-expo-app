import { useApi } from "@/lib/api";
import { Cart } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useCart() {
  const api = useApi();
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get("/cart");
      return data.data as Cart;
    },
  });

  const addToCartMutation = useMutation({
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
      return data.data as Cart;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      }),
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete(`/cart/${productId}`);
      return data.data as Cart;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      }),
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const { data } = await api.patch(`/cart/${productId}`, {
        quantity,
      });
      return data.data as Cart;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      }),
  });

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isAddingToCart: addToCartMutation.isPending,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    isRemoving: removeFromCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
  };
}
