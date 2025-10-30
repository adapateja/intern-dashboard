import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, LayoutDashboard, ShieldCheck, Sparkles, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Navigation = () => {
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="bg-gradient-hero bg-clip-text text-transparent">NextShop</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Products
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/dashboard") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/recommendations"
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                isActive("/recommendations") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Recommended
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/admin") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}

            {user ? (
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <Button asChild size="sm" className="gap-2">
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
