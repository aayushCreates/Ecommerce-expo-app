import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useWishlist() {
  const api = useApi();
  const queryClient = useQueryClient();

  const { data: wishlists, isLoading, isError } = useQuery({
    queryKey: ["Wishlist"],
    queryFn: async () => {
      const { data } = await api.get("/users/wishlist");
      const wishlistData: Product[] = data.data;

      return wishlistData;
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.post("/users/wishlist", {
        productId,
      });
      const userWishlists: string[] = data.data;

      return userWishlists;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      }),
  });

  const removeProductFromWishlist = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete(`/users/wishlist/${productId}`);
      const updatedWishlists: string[] = data.data;

      return updatedWishlists;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      }),
  });

  const isProductInWishlist = (productId: string)=> {
    return wishlists?.some((p)=> p._id === productId) ?? false;
  } 

  const toggleWishlist = (productId: string)=> {  
    if(isProductInWishlist(productId)) {
      removeProductFromWishlist.mutate(productId);
    }else {
      addToWishlistMutation.mutate(productId);
    }
  }

  return {
    wishlists: wishlists || [],
    isLoading,
    isError,
    wishlistCount: wishlists?.length || 0,
    isProductInWishlist,
    toggleWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingToWishlist: removeProductFromWishlist.isPending
  };
}
