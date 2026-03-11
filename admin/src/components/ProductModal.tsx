import { X, ImageIcon, Loader2, Trash2, PackageOpen, Plus } from "lucide-react"
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
  const [previews, setPreviews] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: ""
  })

  const createMutation = useMutation({
    mutationFn: (newProduct: FormData) => productApi.create(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Products"] })
      onClose()
    }
  })

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
        description: data.description || ""
      });
      setPreviews(data.images);
    } else {
      setFormData({
        name: "",
        category: "",
        price: 0,
        stock: 0,
        description: "",
      });
      setPreviews([]);
    }
    setFiles([])
  }, [data, open])

  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    
    const selectedFiles = Array.from(e.target.files)
    const newFiles = [...files, ...selectedFiles].slice(0, 3)
    
    setFiles(newFiles)
    
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    previews.forEach(url => URL.revokeObjectURL(url))
    setPreviews(newPreviews)
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    previews.forEach(url => URL.revokeObjectURL(url))
    setPreviews(newPreviews)
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

      <div className="bg-base-100 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-base-content/5">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-base-content/5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <PackageOpen size={18} className="text-primary" />
            </div>
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Product Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">Product Name</span>
              </label>
              <input
                type="text"
                name="name"
                disabled={isLoading}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Wireless Headphones"
                className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Category */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">Category</span>
              </label>
              <select 
                name="category"
                disabled={isLoading}
                value={formData.category}
                onChange={handleChange}
                className="select select-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="" disabled>Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Fashion">Fashion</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            {/* Price */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">Price ($)</span>
              </label>
              <input
                type="number"
                name="price"
                disabled={isLoading}
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Stock */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-bold">Stock Quantity</span>
              </label>
              <input
                type="number"
                name="stock"
                disabled={isLoading}
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                className="input input-bordered w-full rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

          </div>

          {/* Description */}
          <div className="form-control mt-6">
            <label className="label">
              <span className="label-text font-bold">Product Description</span>
            </label>

            <textarea
              name="description"
              disabled={isLoading}
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell us more about this product..."
              className="textarea textarea-bordered w-full h-28 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Image Upload Area */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-secondary/10 text-secondary">
                  <ImageIcon size={16} />
                </div>
                <span className="font-bold text-sm">Product Images</span>
                <span className="text-[10px] uppercase tracking-wider bg-base-300 px-2 py-0.5 rounded font-bold opacity-60">
                  {files.length}/3
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {/* Previews */}
              {previews.map((url, index) => (
                <div key={url} className="relative aspect-square rounded-xl overflow-hidden group border border-base-content/5">
                  <img src={url} className="w-full h-full object-cover" alt="preview" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => removeFile(index)}
                      className="btn btn-circle btn-error btn-xs border-none"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}

              {/* Upload Button */}
              {files.length < 3 && (
                <label className={`aspect-square rounded-xl border-2 border-dashed border-base-content/10 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${isLoading ? "pointer-events-none opacity-50" : ""}`}>
                  <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-base-content/40">
                    <Plus size={18} />
                  </div>
                  <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest text-center px-2">
                    Add Photo
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    disabled={isLoading}
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-center gap-3 p-6 border-t border-base-content/5 bg-base-200/30">
          <button
            onClick={onClose}
            className="btn btn-ghost rounded-full px-6 font-bold"
            disabled={isLoading}
          >
            Cancel
          </button>

          <button 
            className="btn btn-primary rounded-full px-10 font-black shadow-lg shadow-primary/20" 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Processing...
              </>
            ) : (
              isEdit ? "Save Changes" : "Create Product"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

