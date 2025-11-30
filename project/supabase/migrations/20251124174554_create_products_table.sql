/*
  # Create products table for NHH clothing store

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for each product
      - `name` (text) - Product name
      - `description` (text) - Product description
      - `price` (numeric) - Product price
      - `image_url` (text) - URL to product image
      - `category` (text) - Product category (e.g., shirts, pants, accessories)
      - `sizes` (text array) - Available sizes for the product
      - `in_stock` (boolean) - Whether product is in stock
      - `created_at` (timestamptz) - Timestamp of creation

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access (anyone can view products)

  3. Sample Data
    - Insert sample products for the NHH store
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL,
  sizes text[] DEFAULT ARRAY['S', 'M', 'L', 'XL'],
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category) VALUES
  ('NHH Future Tee', 'Premium black cotton tee with holographic NHH logo', 45.00, 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800', 'shirts'),
  ('Cyber Hoodie', 'Tech-wear inspired hoodie with reflective details', 120.00, 'https://images.pexels.com/photos/7679454/pexels-photo-7679454.jpeg?auto=compress&cs=tinysrgb&w=800', 'hoodies'),
  ('Urban Cargo Pants', 'Tactical style cargo pants with multiple pockets', 95.00, 'https://images.pexels.com/photos/5214413/pexels-photo-5214413.jpeg?auto=compress&cs=tinysrgb&w=800', 'pants'),
  ('Matrix Jacket', 'Futuristic bomber jacket with LED strip details', 200.00, 'https://images.pexels.com/photos/16170/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800', 'jackets'),
  ('Tech Joggers', 'Sleek athletic joggers with zippered pockets', 75.00, 'https://images.pexels.com/photos/5710082/pexels-photo-5710082.jpeg?auto=compress&cs=tinysrgb&w=800', 'pants'),
  ('NHH Cap', 'Minimalist snapback with embroidered logo', 35.00, 'https://images.pexels.com/photos/3755706/pexels-photo-3755706.jpeg?auto=compress&cs=tinysrgb&w=800', 'accessories')
ON CONFLICT DO NOTHING;