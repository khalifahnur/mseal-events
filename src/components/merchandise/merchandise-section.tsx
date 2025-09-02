"use client";

import { MerchandiseTable } from "@/components/merchandise/merchandise-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "../Loader";
import { fetchAllMerchandise } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Merchandise } from "../../../types/merch";
import { ShoppingBag, Store, TrendingUp } from "lucide-react";
import FloatingActionButton from "../FloatBtn";

export function MerchandiseSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["allMerchandise"],
    queryFn: fetchAllMerchandise,
    staleTime: 1000 * 60 * 5,
    //cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loader />;

  const totalItems = data?.count;
  const totalStock = data?.items.reduce(
    (acc: number, item: Merchandise) => acc + item.stock,
    0
  );
  const totalValue = data?.items.reduce(
    (acc: number, item: Merchandise) => acc + item.price * item.stock,
    0
  );

  return (
    <div className="space-y-8 py-6">
      <FloatingActionButton tooltip="Add Merchandise" href="/store/add-merchandise" />
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

      <MerchandiseTable merchandise={data?.items} />
    </div>
  );
}
