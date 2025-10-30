/**
 * Recommendations Page (BONUS)
 * 
 * RENDERING STRATEGY: React Server Components Simulation
 * 
 * In Next.js App Router, this would use Server Components to fetch data.
 * In this React implementation:
 * - Simulates server-side data fetching with aggressive caching
 * - Client-side interactivity (wishlist button) separate from data fetching
 * - Demonstrates the RSC pattern: server data + client interaction
 * 
 * This shows how RSC would work: static data from server, dynamic UI on client.
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image_url?: string;
  description: string;
}

const Recommendations = () => {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  // Simulates Server Component data fetching
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      // Fetch top-rated products (simulating recommendation algorithm)
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("inventory", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Product[];
    },
    staleTime: 10 * 60 * 1000, // Consider fresh for 10 minutes (RSC-like behavior)
  });

  // Client-side interactivity mutation
  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
      toast.success("Removed from wishlist");
    } else {
      newWishlist.add(productId);
      toast.success("Added to wishlist");
    }
    setWishlist(newWishlist);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Recommended For You</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            🎯 RSC Simulation - Data fetched on server, interactive buttons run on client
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-6 border-accent/30 bg-accent/5">
          <CardContent className="py-4">
            <p className="text-sm">
              <strong>React Server Components Pattern:</strong> In Next.js App Router, 
              the product data would be fetched on the server (zero client JS), while the 
              wishlist button remains interactive on the client. This provides the best of 
              both worlds: fast initial load + rich interactivity.
            </p>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((product) => (
              <Card key={product.id} className="group overflow-hidden transition-all hover:shadow-lg">
                <CardHeader className="p-0">
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    {/* Client-side interactive button */}
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-3 right-3 h-10 w-10 rounded-full shadow-lg"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${
                          wishlist.has(product.id) ? "fill-destructive text-destructive" : ""
                        }`}
                      />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{product.category}</Badge>
                    <p className="font-bold text-xl text-primary">${product.price.toFixed(2)}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/products/${product.id}`}>View Product</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Wishlist Summary */}
        {wishlist.size > 0 && (
          <Card className="mt-8 border-accent">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent" />
                <h3 className="font-semibold">Your Wishlist</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You have {wishlist.size} {wishlist.size === 1 ? "item" : "items"} in your wishlist
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
