/**
 * Inventory Dashboard Page
 * 
 * RENDERING STRATEGY: Server-Side Rendering (SSR) Simulation
 * 
 * In Next.js, this would use getServerSideProps to fetch data on every request.
 * In this React implementation:
 * - Data is fetched on every mount (no caching via staleTime: 0)
 * - React Query is configured to always refetch when window regains focus
 * - Manual refresh button triggers immediate refetch
 * - Shows real-time inventory statistics
 * 
 * This simulates SSR by always fetching fresh data from the server.
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, TrendingDown, DollarSign, RefreshCw, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  inventory: number;
  price: number;
}

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // SSR Simulation: Always fetch fresh data (no caching)
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category, inventory, price")
        .order("inventory", { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
    staleTime: 0, // Always consider data stale (simulates SSR - always fresh)
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Calculate statistics
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.inventory < 15).length;
  const totalValue = products.reduce((sum, p) => sum + p.inventory * p.price, 0);
  const outOfStock = products.filter((p) => p.inventory === 0).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Inventory Dashboard</h1>
            <p className="text-muted-foreground">
              ⚡ SSR Simulation - Real-time data fetched on every page load
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active inventory items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              <TrendingDown className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Items with &lt; 15 units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                ${totalValue.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Combined stock value
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{outOfStock}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Items needing restock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Stock</p>
                        <p className="font-semibold">{product.inventory} units</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Value</p>
                        <p className="font-semibold text-accent">
                          ${(product.inventory * product.price).toFixed(2)}
                        </p>
                      </div>
                      {product.inventory === 0 ? (
                        <Badge variant="destructive">Out of Stock</Badge>
                      ) : product.inventory < 15 ? (
                        <Badge variant="outline" className="border-warning text-warning">
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="secondary">In Stock</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
