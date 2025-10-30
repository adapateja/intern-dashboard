import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  inventory: number;
  imageUrl?: string;
}

export const ProductCard = ({ id, name, slug, price, category, inventory, imageUrl }: ProductCardProps) => {
  const isLowStock = inventory < 15;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{name}</h3>
          {isLowStock && (
            <Badge variant="outline" className="gap-1 border-warning text-warning">
              <AlertCircle className="h-3 w-3" />
              Low Stock
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{category}</Badge>
          <p className="font-bold text-xl text-primary">${price.toFixed(2)}</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{inventory} in stock</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/products/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
