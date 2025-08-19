"use client";

import { useState } from "react";
import { MerchandiseForm } from "@/components/merchandise/merchandise-form";
import { MerchandiseTable } from "@/components/merchandise/merchandise-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "../Loader";
import { fetchAllMerchandise } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Merchandise } from "../../../types/merch";
import { ArrowLeft, Plus, ShoppingBag, Store, TrendingUp } from "lucide-react";

export function MerchandiseSection() {
  const [showAddForm, setShowAddForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["allMerchandise"],
    queryFn: fetchAllMerchandise,
    staleTime: 1000 * 60 * 5,
    //cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loader />;

  // const activeTickets = data?.tickets ?? [];

  // if (activeTickets.length === 0) {
  //   return (
  //     <div className="flex flex-col items-center justify-center py-12 text-center">
  //       <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
  //       <h3 className="text-xl font-medium mb-2">No active tickets</h3>
  //       <p className="text-muted-foreground mb-6">
  //         You don&apos;t have any upcoming matches to attend.
  //       </p>
  //       <Button asChild>
  //         <a href="/tickets">Browse Tickets</a>
  //       </Button>
  //     </div>
  //   );
  // }

  const totalItems = data?.count;
  const totalStock = data?.items.reduce((acc:number, item:Merchandise) => acc + item.stock, 0);
  const totalValue = data?.items.reduce(
    (acc:number, item:Merchandise) => acc + item.price * item.stock,
    0
  );

  return (
    <div className="space-y-8 py-6">
       <div className="fixed bottom-10 right-2 bg-transparent">
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-full w-16 h-16 flex items-center justify-center bg-gradient-to-r from-gray-700 to-[#fae115] hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          size="lg"
        >
          {showAddForm ? (
            <ArrowLeft className="h-2 w-2" />
          ) : (
            <Plus className="h-2 w-2" />
          )}
        </Button>
      </div>

      {!showAddForm && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Total Items
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                {totalItems}
              </div>

            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Total Stock
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                Ksh {totalStock.toLocaleString()}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Across all store
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                  Inventory Value
                </CardTitle>
                <Store className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-900 dark:text-green-100">
                Ksh {totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Maximum earnings
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {showAddForm ? (
        <MerchandiseForm
          onSubmit={() => {
            setShowAddForm(false);
          }}
        />
      ) : (
        <MerchandiseTable
          merchandise={data?.items}
        />
      )}
    </div>
  );
}
