CREATE TABLE IF NOT EXISTS products(
 id serial PRIMARY KEY, sku text UNIQUE NOT NULL, name text NOT NULL, brand text, description text,
 price_kobo integer NOT NULL CHECK(price_kobo>0), stock integer NOT NULL DEFAULT 0 CHECK(stock>=0),
 image_url text, active boolean NOT NULL DEFAULT true, is_sample boolean NOT NULL DEFAULT false, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS orders(
 id serial PRIMARY KEY, reference text UNIQUE NOT NULL, email text NOT NULL, name text NOT NULL, phone text NOT NULL,
 address text NOT NULL, state text NOT NULL, city text NOT NULL,
 subtotal_kobo integer NOT NULL, shipping_kobo integer NOT NULL, total_kobo integer NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','review','processing','shipped','delivered','cancelled','refunded')),
 created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS order_items(
 id serial PRIMARY KEY, order_id integer NOT NULL REFERENCES orders(id), product_id integer NOT NULL REFERENCES products(id),
 qty integer NOT NULL CHECK(qty>0), unit_price_kobo integer NOT NULL);
CREATE TABLE IF NOT EXISTS payments(
 reference text PRIMARY KEY, order_id integer NOT NULL REFERENCES orders(id), amount_kobo integer NOT NULL, raw jsonb, paid_at timestamptz);
