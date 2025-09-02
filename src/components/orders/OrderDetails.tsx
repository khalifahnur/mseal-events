"use client";

import React, { useState } from "react";
import {
  X,
  ExternalLink,
  User,
  Mail,
  Phone,
  Copy,
  Printer,
  MoreHorizontal,
  Package,
} from "lucide-react";
import Image from "next/image";

interface OrderDetailsProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  order: any;
}

export default function OrderDetails({ open, setOpen, order }: OrderDetailsProps) {
  const [activeTab, setActiveTab] = useState("Order Items");

  if (!open || !order) return null;

  const tabs = ["Order Items", "Delivery", "Docs"];

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(order, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${order.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-section")?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open("", "", "height=600,width=800");
    if (printWindow) {
      printWindow.document.write("<html><head><title>Print Order</title></head><body>");
      printWindow.document.write(printContent);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />

      {/* Modal */}
      <div className="relative bg-white w-96 h-full shadow-xl border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Order {order.id}</h2>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1.5 hover:bg-gray-200 rounded-md transition-colors">
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{order.customer}</h3>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{order.customerEmail || "N/A"}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>{order.phoneNumber}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto" id="print-section">
          {activeTab === "Order Items" && (
            <div className="p-4">
              <div className="space-y-4">
                {order.details.map((item: any) => (
                  <div
                    key={item._id}
                    className="flex space-x-3 p-3 border border-gray-200 rounded-lg"
                  >
                    <Image
                      src={item.productId.imageUrl}
                      alt={item.productId.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {item.productId.name}
                      </p>
                      <p className="text-xs text-gray-500">{item.productId.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500">
                          {item.quantity} × Ksh {item.price}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          Ksh {item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-gray-900">{order.total}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Delivery" && (
            <div className="p-4">
              <p className="text-gray-700">{order.delivery}</p>
            </div>
          )}

          {activeTab === "Docs" && (
            <div className="p-4">
              <p className="text-gray-500">No documents uploaded yet</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Export</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print</span>
          </button>

          <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Copy className="w-4 h-4" />
            <span>Duplicate</span>
          </button>

          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
