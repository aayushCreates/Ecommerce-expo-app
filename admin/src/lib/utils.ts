export const capitalizeText = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  
  export const getOrderStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "badge-success bg-success/10 border-success/10";
      case "shipped":
        return "badge-info bg-info/10 border-info/10 ";
      case "pending":
        return "badge-warning bg-warning/10 border-warning/10";
      default:
        return "badge-ghost bg-ghost/10 border-ghost/10";
    }
  };
  
  export const getStockStatusBadge = (stock: number) => {
    if (stock === 0) return { text: "Out of Stock", class: "badge-error bg-error/5 border-error/40" };
    if (stock < 20) return { text: "Low Stock", class: "badge-warning bg-warning/5 border-warning/40" };
    return { text: "In Stock", class: "badge-success bg-success/5 border-success/40" };
  };
  
  export const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
  
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };