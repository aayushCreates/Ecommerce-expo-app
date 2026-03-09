import { X, ImageIcon, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import type { Product } from "../pages/Products"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { productApi } from "../lib/api"

type Props = {
  open: boolean
  onClose: () => void
  data: Product | null
}

export default function ProductModal({ open, onClose, data }: Props) {
  const queryClient = useQueryClient()
  const [files, setFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: ""
  })

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (newProduct: FormData) => productApi.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products"] })
      onClose()
    }
  })

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => 
      productApi.update({ id, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products"] })
      onClose()
    }
  })

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name,
        category: data.category,
        price: data.price,
        stock: data.stock,
        description: "" 
      })
    } else {
      setFormData({
        name: "",
        category: "",
        price: 0,
        stock: 0,
        description: ""
      })
    }
    setFiles([])
  }, [data, open])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files).slice(0, 3)
    setFiles(selected)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value
    }))
  }

  const handleSubmit = () => {
    const dataToSend = new FormData()
    dataToSend.append("name", formData.name)
    dataToSend.append("category", formData.category)
    dataToSend.append("price", formData.price.toString())
    dataToSend.append("stock", formData.stock.toString())
    dataToSend.append("description", formData.description)
    
    files.forEach((file) => {
      dataToSend.append("images", file)
    })

    if (data) {
      updateMutation.mutate({ id: data.id, formData: dataToSend })
    } else {
      createMutation.mutate(dataToSend)
    }
  }

  if (!open) return null

  const isEdit = !!data
  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-base-100 w-[720px] rounded-xl shadow-xl p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{isEdit ? "Edit Product" : "Add New Product"}</h2>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isLoading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">

          {/* Product Name */}
          <div>
            <label className="label text-sm">Product Name</label>
            <input
              type="text"
              name="name"
              disabled={isLoading}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="input input-bordered w-full"
            />
          </div>

          {/* Category */}
          <div>
            <label className="label text-sm">Category</label>
            <select 
              name="category"
              disabled={isLoading}
              value={formData.category}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="Electronics">Electronics</option>
              <option value="Books">Books</option>
              <option value="Fashion">Fashion</option>
              <option value="Sports">Sports</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="label text-sm">Price ($)</label>
            <input
              type="number"
              name="price"
              disabled={isLoading}
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              className="input input-bordered w-full"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="label text-sm">Stock</label>
            <input
              type="number"
              name="stock"
              disabled={isLoading}
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              className="input input-bordered w-full"
            />
          </div>

        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="label text-sm">Description</label>

          <textarea
            name="description"
            disabled={isLoading}
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className="textarea textarea-bordered w-full h-24"
          />
        </div>

        {/* Image Upload */}
        <div className="mt-4">

          <div className="flex items-center gap-2 mb-2 text-sm">
            <ImageIcon size={16} />
            <span className="font-medium">Product Images</span>
            <span className="opacity-60">Max 3 images</span>
          </div>

          <div className="border border-base-300 rounded-lg p-3 flex items-center gap-4">

            <label className={`btn btn-success btn-sm cursor-pointer ${isLoading ? "btn-disabled" : ""}`}>
              Choose Files
              <input
                type="file"
                multiple
                hidden
                disabled={isLoading}
                onChange={handleFileChange}
              />
            </label>

            <span className="text-sm opacity-70">
              {files.length
                ? `${files.length} file(s) selected`
                : "No file chosen"}
            </span>

          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Cancel
          </button>

          <button 
            className="btn btn-success" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="animate-spin" size={16} />}
            {isEdit ? "Save Changes" : "Add Product"}
          </button>

        </div>
      </div>
    </div>
  )
}