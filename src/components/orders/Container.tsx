"use client";

import React, { useState } from "react";
import {
  Package,
  Check,
  Clock,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Filter,
  Search,
  Download,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/lib/api";
import OrderDetails from "./OrderDetails";
import Loader from "../Loader";
import UpdateConfirmDialog from "./UpdateConfirmDialog";
import { useUpdateOrder } from "@/hooks/merchHook/useMerchandise";

interface Order {
  _id: string;
  orderId: string;
  createdAt: string;
  userInfo: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
  items: { productId: string; quantity: number; price: number }[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    country: string;
  };
}

const OrderManagement = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [previewData, setPreviewData] = useState<Order | null>(null);
  const [merchToUpdate, setMerchToUpdate] = useState<Order | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  const updateStatusMutation = useUpdateOrder();

  const { data, error, isPending } = useQuery<{ items: Order[] }>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const handleUpdateItem = () => {
    if (merchToUpdate) {
      updateStatusMutation.mutate({
        itemId: merchToUpdate._id || "",
      });
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const orders =
    data?.items.map((item) => ({
      _id: item._id,
      id: item.orderId,
      date: new Date(item.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      customer: `${item.userInfo.firstName} ${item.userInfo.lastName}`,
      payment: item.paymentStatus === "Completed" ? "Success" : "Pending",
      total: `Ksh ${item.totalAmount.toLocaleString()}`,
      delivery: `${item.shippingAddress.street || "N/A"}, ${
        item.shippingAddress.city
      }, ${item.shippingAddress.country}`,
      items: item.items.reduce((sum, i) => sum + i.quantity, 0),
      status: item.status === "Processing" ? "Unfulfilled" : item.status,
      phoneNumber: item.userInfo.phoneNumber,
      customerEmail: item.userInfo.email,
      details: item.items,
    })) || [];

  const getStatusBadge = (status: string) => {
    if (status === "Fulfilled") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Fulfilled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
        <Clock className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const getPaymentBadge = (payment: string) => {
    if (payment === "Success") {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
          Success
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
        Pending
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeFilter === "All") return matchesSearch;
    if (activeFilter === "Pending")
      return matchesSearch && order.status === "Pending";
    if (activeFilter === "Unfulfilled")
      return matchesSearch && order.status === "Unfulfilled";
    if (activeFilter === "Completed")
      return matchesSearch && order.status === "Delivered";

    return matchesSearch;
  });

  const getFilterCount = (filter: string) => {
    if (filter === "All") return orders.length;
    if (filter === "Pending")
      return orders.filter((o) => o.status === "Pending").length;
    if (filter === "Unfulfilled")
      return orders.filter((o) => o.status === "Unfulfilled").length;
    if (filter === "Completed")
      return orders.filter((o) => o.status === "Delivered").length;
    return 0;
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Unfulfilled").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;

  if (isPending) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load orders. Please try again.
      </div>
    );
  }

  const previewHandler = (data: any) => {
    setPreviewData(data);
    setOpen(true);
  };

  const handleStatusUpdate = (item: any) => {
    setMerchToUpdate(item);
    setUpdateDialogOpen(true);
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Header */}
        <div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{today}</span>
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                More actions
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-2xl font-semibold text-gray-900">
                {totalOrders}
              </p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-2xl font-semibold text-gray-900">
                {pendingOrders}
              </p>
              <p className="text-sm text-gray-600">Pending Orders</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-2xl font-semibold text-gray-900">
                {completedOrders}
              </p>
              <p className="text-sm text-gray-600">Fulfilled Orders</p>
            </div>
          </div>

          {/* Filters + Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Filters */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {["All", "Pending", "Unfulfilled", "Completed"].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`text-sm font-medium px-3 py-1 rounded-md ${
                        activeFilter === filter
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {filter} ({getFilterCount(filter)})
                    </button>
                  )
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fulfillment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {order.customer}
                      </td>
                      <td className="px-4 py-4">
                        {getPaymentBadge(order.payment)}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                        {order.total}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {order.delivery}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {order.items} items
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => previewHandler(order)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {activeFilter == "Unfulfilled" && (
                            <button
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => handleStatusUpdate(order)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}

                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <OrderDetails open={open} setOpen={setOpen} order={previewData} />
      <UpdateConfirmDialog
        isOpen={updateDialogOpen}
        onClose={() => {
          setUpdateDialogOpen(false);
          setMerchToUpdate(null);
        }}
        onConfirm={handleUpdateItem}
        itemName={merchToUpdate?.orderId}
      />
    </>
  );
};

export default OrderManagement;
