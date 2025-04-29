"use client";

import { useState } from "react";
import type { Merchandise } from "@/components/dashboard";
import { MerchandiseForm } from "@/components/merchandise/merchandise-form";
import { MerchandiseTable } from "@/components/merchandise/merchandise-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import Loader from "../Loader";
import { fetchAllMerchandise } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface MerchandiseSectionProps {
  merchandise: Merchandise[];
  onAddMerchandise: (item: Omit<Merchandise, "id">) => void;
  onDeleteMerchandise: (id: string) => void;
}

export function MerchandiseSection({
  onAddMerchandise,
  onDeleteMerchandise,
}: MerchandiseSectionProps) {
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
  const totalStock = data?.items.reduce((acc, item) => acc + item.stock, 0);
  const totalValue = data?.items.reduce(
    (acc, item) => acc + item.price * item.stock,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Merchandise Management</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "View Merchandise" : "Add New Item"}
        </Button>
      </div>

      {!showAddForm && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStock.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Inventory Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Ksh {totalValue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showAddForm ? (
        <MerchandiseForm
          onSubmit={(item) => {
            onAddMerchandise(item);
            setShowAddForm(false);
          }}
        />
      ) : (
        <MerchandiseTable
          merchandise={data?.items}
          onDelete={onDeleteMerchandise}
        />
      )}
    </div>
  );
}
