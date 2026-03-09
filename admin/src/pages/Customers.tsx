import React from "react";
import { Users, PackageOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "../lib/api";
import PageLoader from "../components/PageLoader";
import { formatDate } from "../lib/utils";

type Customer = {
  id: number;
  name: string;
  email: string;
  addresses: number;
  wishlist: number;
  joined: string;
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const Customers: React.FC = () => {
  const { data: customers, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getAll,
  });

  if (isLoading) {
    return <PageLoader />;
  }

  const hasCustomers = customers && customers.length > 0;

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold">Customers</h1>
            <span className="badge badge-neutral bg-neutral-700/50 border-none rounded-md px-2 py-0.5 text-xs">
              {customers?.length || 0} Total
            </span>
          </div>
          <p className="text-sm opacity-60">
            View and manage your registered customers
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-neutral-700/5 border border-gray-400/10 rounded-xl overflow-hidden">
          {hasCustomers ? (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="bg-neutral-500/10">
                  <tr className="text-base-content/60 text-sm border-none">
                    <th className="py-4">Customer</th>
                    <th>Email</th>
                    <th>Addresses</th>
                    <th>Wishlist</th>
                    <th>Joined Date</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer: Customer) => (
                    <tr key={customer.id} className="border-gray-400/5 hover:bg-neutral-700/5 transition-colors">

                      {/* Customer Info */}
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral-700/50 text-neutral-content rounded-full w-10 border border-gray-400/10">
                              <span className="text-xs font-bold">
                                {getInitials(customer.name)}
                              </span>
                            </div>
                          </div>

                          <div className="font-semibold">
                            {customer.name}
                          </div>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td className="text-sm opacity-70">
                        {customer.email}
                      </td>

                      {/* Saved Addresses Count */}
                      <td className="text-sm opacity-80">
                        {customer.addresses === 1 ? "1 address" : `${customer.addresses} addresses`}
                      </td>

                      {/* Wishlist Items Count */}
                      <td className="text-sm opacity-80">
                        {customer.wishlist === 1 ? "1 item" : `${customer.wishlist} items`}
                      </td>

                      {/* Registration Date */}
                      <td className="text-sm opacity-60 whitespace-nowrap">
                        {formatDate(customer.joined)}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-400/10 rounded-xl m-4">
              <div className="bg-neutral-700/10 p-5 rounded-full mb-4 text-gray-500">
                <Users size={56} />
              </div>
              <h3 className="text-xl font-bold">No customers found</h3>
              <p className="text-sm opacity-60 mt-1 text-center max-w-xs">
                Your customer directory is currently empty. New registered users will automatically appear here.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Customers;