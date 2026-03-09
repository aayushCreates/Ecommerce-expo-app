import { Pencil, Trash2, Plus, PackageOpen } from "lucide-react";
import { useState } from "react";
import ProductModal from "../components/ProductModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../lib/api";
import PageLoader from "../components/PageLoader";
import { getStockStatusBadge } from "../lib/utils";
import ConfirmationModal from "../components/confirmationModal";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
};

export default function Products() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ["Products"],
    queryFn: productApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products"] });
      setDeleteModal(false);
      setProductToDelete(null);
    }
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setDeleteModal(true);
  };

  const handleConfirm = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.toString());
    }
  };

  if(isLoading) {
    return <PageLoader />
  }

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm opacity-60">Manage your product inventory</p>
        </div>

        <button
          className="btn btn-success btn-sm gap-2 rounded-sm"
          onClick={handleAdd}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Products List */}
      {products && products.length > 0 ? (
        <div className="space-y-4">
          {products.map((product: Product) => (
            <div
              key={product.id}
              className="card bg-neutral-700/10 border border-gray-400/10 rounded-md"
            >
              <div className="card-body flex flex-row items-center justify-between">

                {/* Left */}
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    className="w-14 h-14 rounded-lg object-cover"
                  />

                  <div>
                    <h2 className="font-semibold">{product.name}</h2>

                    <p className="text-sm opacity-60">{product.category}</p>

                    <div className="flex gap-6 text-sm mt-1">
                      <div>
                        <span className="opacity-60">Price</span>
                        <p className="font-semibold">${product.price}</p>
                      </div>

                      <div>
                        <span className="opacity-60">Stock</span>
                        <p className="font-semibold">{product.stock} units</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-6">
                  <span className={`badge badge-outline rounded-sm  ${getStockStatusBadge(product.stock).class}`}>
                    { getStockStatusBadge(product.stock).text }
                  </span>

                  <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(product)}>
                    <Pencil size={16} />
                  </button>

                  <button className="btn btn-ghost btn-sm text-error" onClick={()=> handleDeleteClick(product.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-neutral-700/5 border border-dashed border-gray-400/20 rounded-xl">
          <div className="bg-neutral-700/10 p-4 rounded-full mb-4 text-gray-400">
            <PackageOpen size={48} />
          </div>
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-sm opacity-60 mb-6 text-center max-w-xs">
            Your inventory is empty. Start by adding your first product to the store.
          </p>
          <button
            className="btn btn-success btn-sm gap-2 rounded-md"
            onClick={handleAdd}
          >
            <Plus size={16} />
            Add First Product
          </button>
        </div>
      )}

      <ProductModal open={showModal} onClose={() => setShowModal(false)} data={selectedProduct} />

      <ConfirmationModal
        isOpen={deleteModal}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onCancel={() => setDeleteModal(false)}
        onConfirm={handleConfirm}
      />

    </div>
  );
}
