-- SAMPLE products only. Replace with real inventory.
INSERT INTO products(sku,name,brand,price_kobo,stock,is_sample) VALUES
('TG-MCU-001','ESP32 DevKit (30-pin)','Espressif',850000,12,true),
('TG-SNS-001','DHT11 Temp & Humidity Sensor','Generic',180000,40,true)
ON CONFLICT DO NOTHING;
