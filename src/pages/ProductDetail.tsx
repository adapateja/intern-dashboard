/**
 * Product Detail Page
 * 
 * RENDERING STRATEGY: Incremental Static Regeneration (ISR) Simulation
 * 
 * In Next.js, this would use getStaticProps with revalidate: 60.
 * In this React implementation:
 * - React Query refetches data every 60 seconds (refetchInterval)
 * - Initial data loads immediately from cache if available
 * - Background revalidation keeps data fresh
 * - Shows "Last Updated" timestamp to demonstrate ISR behavior
 * 
 * This simulates ISR by periodically refetching while serving cached data.
 */

import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Package, Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  image_url?: string;
  last_updated: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  // ISR Simulation: Refetch every 60 seconds while showing cached data
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Product;
    },
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: 60 * 1000, // Refetch every 60 seconds (simulates ISR revalidation)
  });

  const isLowStock = product && product.inventory < 15;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="mb-8 h-8 w-32 bg-muted rounded" />
            <div className="grid gap-8 md:grid-cols-2">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-12 bg-muted rounded" />
                <div className="h-6 w-32 bg-muted rounded" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/">Return to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        {/* ISR Indicator */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-2 py-3 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              <strong>ISR Simulation:</strong> This page revalidates every 60 seconds. 
              Last updated {formatDistanceToNow(new Date(product.last_updated), { addSuffix: true })}
            </span>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-start justify-between gap-4">
                <h1 className="text-4xl font-bold">{product.name}</h1>
                {isLowStock && (
                  <Badge variant="outline" className="gap-1 border-warning text-warning">
                    <AlertCircle className="h-3 w-3" />
                    Low Stock
                  </Badge>
                )}
              </div>
              <Badge variant="secondary" className="text-base">
                {product.category}
              </Badge>
            </div>

            <p className="text-5xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>

            <Card>
              <CardContent className="flex items-center gap-3 py-4">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-semibold">Stock Availability</p>
                  <p className="text-sm text-muted-foreground">
                    {product.inventory} units available
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Button size="lg" className="w-full">
              Add to Cart
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Product ID: {product.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
