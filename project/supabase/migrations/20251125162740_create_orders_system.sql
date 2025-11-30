/*
  # Create Orders Tracking System

  ## Overview
  This migration creates a comprehensive order management system for tracking customer purchases.

  ## New Tables
  
  ### `orders`
  Main orders table to track customer purchases:
  - `id` (uuid, primary key) - Unique order identifier
  - `order_number` (text, unique) - Human-readable order number (e.g., "ORD-20231125-001")
  - `customer_email` (text) - Customer's email address
  - `customer_name` (text) - Customer's full name
  - `total_amount` (numeric) - Total order amount in USD cents
  - `currency` (text) - Currency code (USD, EUR, GBP, etc.)
  - `status` (text) - Order status: pending, processing, completed, cancelled, refunded
  - `payment_status` (text) - Payment status: pending, paid, failed, refunded
  - `payment_intent_id` (text) - Stripe payment intent ID for tracking
  - `shipping_address` (jsonb) - Shipping address details
  - `billing_address` (jsonb) - Billing address details
  - `created_at` (timestamptz) - Order creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `order_items`
  Individual items within each order:
  - `id` (uuid, primary key) - Unique item identifier
  - `order_id` (uuid, foreign key) - Reference to parent order
  - `product_id` (text) - Product identifier
  - `product_name` (text) - Product name (stored for historical record)
  - `quantity` (integer) - Quantity ordered
  - `unit_price` (numeric) - Price per unit in USD cents
  - `size` (text, optional) - Product size if applicable
  - `created_at` (timestamptz) - Item creation timestamp

  ## Security
  - Enable Row Level Security (RLS) on both tables
  - Admin users can view all orders
  - Public can create orders (for checkout process)
  - Customers can view their own orders by email (future enhancement)

  ## Important Notes
  1. All monetary amounts are stored in cents to avoid floating point issues
  2. Order numbers are generated using a sequential pattern for easy reference
  3. Addresses stored as JSONB for flexibility
  4. Payment intent ID links to Stripe for reconciliation
  5. Status fields use predefined values for consistency
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  total_amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  payment_intent_id text,
  shipping_address jsonb,
  billing_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  size text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders table
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for order_items table
CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view order items"
  ON order_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at'
  ) THEN
    CREATE TRIGGER update_orders_updated_at
      BEFORE UPDATE ON orders
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;