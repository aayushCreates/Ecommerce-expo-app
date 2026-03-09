import { DollarSign, ShoppingCart, Users, Box } from "lucide-react";
import StatCard from "../components/Stats";
import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "../lib/api";
import PageLoader from "../components/PageLoader";
import { formatDate, getOrderStatusBadge } from "../lib/utils";

type Order = {
  id: string;
  customer: string;
  items: string;
  amount: number;
  status: string;
  date: string;
};

export default function Dashboard() {
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getAll,
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["Stats"],
    queryFn: statsApi.getDashboard,
  });

  if (ordersLoading || statsLoading) {
    return <PageLoader />;
  }

  const recentOrders = orders?.slice(0, 5) || [];

  const statsBox = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: <DollarSign size={22} />
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toString() || "0",
      icon: <ShoppingCart size={22} />
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers?.toString() || "0",
      icon: <Users size={22} />
    },
    {
      title: "Total Products",
      value: stats?.totalProducts?.toString() || "0",
      icon: <Box size={22} />
    },
  ]

  return (
    <div className="p-8 min-h-screen text-base-content">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {
          statsBox.map((s, index)=> (
            <StatCard 
              key={index}
              title={s.title} 
              value={s.value} 
              icon={s.icon} 
            />
          ))
        }
      </div>

      {/* Recent Orders */}
      <div className="card bg-neutral-700/5 border border-gray-400/10 rounded-md">
        <div className="card-body">
          <h2 className="card-title mb-4">Recent Orders</h2>

          <div className="overflow-x-auto rounded-lg">
            <table className="table">
              <thead className="bg-neutral-500/10">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order: Order) => (
                    <tr
                      key={order.id}
                      className="bg-neutral-800/10 rounded-sm hover:bg-neutral-700/10"
                    >
                      <td className="font-mono text-sm">{order.id}</td>

                      <td>
                        <div className="font-semibold">{order.customer}</div>
                      </td>

                      <td className="opacity-80">{order.items}</td>

                      <td className="font-semibold">${order.amount}</td>

                      <td>
                        <span className={`badge badge-outline rounded-sm ${getOrderStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>

                      <td className="opacity-70">{formatDate(order.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8 opacity-60">
                      No recent orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
