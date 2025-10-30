-- Create products table with e-commerce schema
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  inventory INTEGER NOT NULL DEFAULT 0 CHECK (inventory >= 0),
  image_url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster slug lookups
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read products
CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  USING (true);

-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Only admins can insert/update/delete products
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Function to update last_updated timestamp
CREATE OR REPLACE FUNCTION public.update_product_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update last_updated
CREATE TRIGGER update_products_timestamp
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_timestamp();

-- Seed demo products
INSERT INTO public.products (name, slug, description, price, category, inventory, image_url) VALUES
  ('Wireless Headphones Pro', 'wireless-headphones-pro', 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.', 199.99, 'Electronics', 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop'),
  ('Smart Watch Series 5', 'smart-watch-series-5', 'Advanced fitness tracking, heart rate monitoring, and seamless smartphone integration.', 299.99, 'Electronics', 12, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop'),
  ('Ultra HD 4K Monitor', 'ultra-hd-4k-monitor', '27-inch 4K display with HDR support, perfect for creative professionals and gamers.', 449.99, 'Electronics', 28, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=600&fit=crop'),
  ('Ergonomic Office Chair', 'ergonomic-office-chair', 'Premium mesh back office chair with lumbar support and adjustable armrests.', 349.99, 'Furniture', 8, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop'),
  ('Standing Desk Pro', 'standing-desk-pro', 'Electric height-adjustable standing desk with memory presets and cable management.', 599.99, 'Furniture', 15, 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&h=600&fit=crop'),
  ('Mechanical Keyboard RGB', 'mechanical-keyboard-rgb', 'Customizable RGB mechanical keyboard with cherry switches and aluminum frame.', 149.99, 'Electronics', 52, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop'),
  ('Wireless Mouse Elite', 'wireless-mouse-elite', 'Precision wireless mouse with customizable buttons and ergonomic design.', 79.99, 'Electronics', 67, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=600&fit=crop'),
  ('Laptop Stand Aluminum', 'laptop-stand-aluminum', 'Sleek aluminum laptop stand with adjustable height and excellent cooling.', 59.99, 'Accessories', 34, 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800&h=600&fit=crop'),
  ('USB-C Hub 7-in-1', 'usb-c-hub-7-in-1', 'Versatile USB-C hub with HDMI, USB 3.0, SD card reader, and fast charging.', 49.99, 'Accessories', 89, 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=600&fit=crop'),
  ('Desk Lamp LED Smart', 'desk-lamp-led-smart', 'Smart LED desk lamp with adjustable brightness, color temperature, and USB charging port.', 89.99, 'Accessories', 3, 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=800&h=600&fit=crop'),
  ('Webcam HD Pro', 'webcam-hd-pro', 'Professional 1080p webcam with auto-focus, low-light correction, and noise reduction.', 129.99, 'Electronics', 41, 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=800&h=600&fit=crop'),
  ('Portable SSD 1TB', 'portable-ssd-1tb', 'Ultra-fast portable SSD with 1TB storage, USB-C connectivity, and rugged design.', 179.99, 'Electronics', 56, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=600&fit=crop');