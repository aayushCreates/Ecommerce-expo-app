import React from "react";
import { ChevronDown, PackageOpen, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "../lib/api";
import PageLoader from "../components/PageLoader";
import { formatDate, getOrderStatusBadge } from "../lib/utils";

type Order = {
  id: string;
  customer: string;
  location: string;
  items: string;
  amount: number;
  status: string;
  date: string;
};

const Orders: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      orderApi.updateStatus({ id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });

  if (isLoading) {
    return <PageLoader />;
  }

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm opacity-60">
            Manage and track customer orders
          </p>
        </div>

        {/* Table Content */}
        <div className="bg-neutral-700/5 border border-gray-400/10 rounded-xl overflow-hidden">
          {orders && orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-neutral-500/10">
                  <tr className="text-base-content/60 text-sm border-none">
                    <th className="py-4">Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order: Order) => (
                    <tr key={order.id} className="border-gray-400/5 hover:bg-neutral-700/5 transition-colors">
                      {/* Order ID */}
                      <td className="font-mono text-sm opacity-80 py-4">{order.id}</td>

                      {/* Customer */}
                      <td>
                        <div>
                          <div className="font-semibold">{order.customer}</div>
                          <div className="text-xs opacity-50">
                            {order.location || "Online Order"}
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="text-sm opacity-70">
                        {order.items}
                      </td>

                      {/* Total */}
                      <td className="font-bold text-base-content/90">${order.amount}</td>

                      {/* Status */}
                      <td>
                        <div className="dropdown dropdown-bottom dropdown-end">
                          <label
                            tabIndex={0}
                            className={`btn btn-xs border-none rounded-sm gap-1 min-w-[100px] justify-between ${getOrderStatusBadge(order.status)}`}
                          >
                            <span className="flex items-center gap-1">
                              {updateStatusMutation.isPending && updateStatusMutation.variables?.id === order.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : null}
                              {order.status}
                            </span>
                            <ChevronDown size={14} />
                          </label>

                          <ul
                            tabIndex={0}
                            className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-lg w-32 z-10 border border-gray-400/10 mt-1"
                          >
                            <li className="menu-title text-[10px] uppercase opacity-50 px-2 py-1 font-bold">Update Status</li>
                            <li>
                              <button 
                                onClick={() => handleStatusUpdate(order.id, "Pending")}
                                className="text-xs py-2 hover:bg-warning/10"
                              >Pending</button>
                            </li>
                            <li>
                              <button 
                                onClick={() => handleStatusUpdate(order.id, "Shipped")}
                                className="text-xs py-2 hover:bg-info/10"
                              >Shipped</button>
                            </li>
                            <li>
                              <button 
                                onClick={() => handleStatusUpdate(order.id, "Delivered")}
                                className="text-xs py-2 hover:bg-success/10"
                              >Delivered</button>
                            </li>
                          </ul>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="text-sm opacity-60 whitespace-nowrap">{formatDate(order.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-400/10 rounded-xl m-4">
              <div className="bg-neutral-700/10 p-5 rounded-full mb-4 text-gray-500">
                <PackageOpen size={56} />
              </div>
              <h3 className="text-xl font-bold">No orders found</h3>
              <p className="text-sm opacity-60 mt-1 text-center max-w-xs">
                When customers purchase your products, their orders will appear here for management.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Orders;