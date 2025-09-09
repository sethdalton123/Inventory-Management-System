-- Create parts table for inventory management
CREATE TABLE public.parts (
  id BIGSERIAL PRIMARY KEY,
  part_name TEXT NOT NULL,
  part_number TEXT UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_threshold INTEGER NOT NULL DEFAULT 5,
  supplier_name TEXT,
  supplier_contact TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table for alerts
CREATE TABLE public.notifications (
  id BIGSERIAL PRIMARY KEY,
  part_id BIGINT REFERENCES public.parts(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is an internal business app)
CREATE POLICY "Allow all operations on parts" ON public.parts
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on notifications" ON public.notifications
FOR ALL USING (true) WITH CHECK (true);

-- Create function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_parts_last_updated
  BEFORE UPDATE ON public.parts
  FOR EACH ROW
  EXECUTE FUNCTION update_last_updated_column();

-- Create function to check stock levels and create notifications
CREATE OR REPLACE FUNCTION check_stock_levels()
RETURNS VOID AS $$
DECLARE
  part_record RECORD;
BEGIN
  FOR part_record IN 
    SELECT id, part_name, quantity, min_threshold 
    FROM public.parts 
    WHERE quantity <= min_threshold
  LOOP
    -- Check if notification already exists for this part
    IF NOT EXISTS (
      SELECT 1 FROM public.notifications 
      WHERE part_id = part_record.id 
      AND status = 'unread'
      AND message LIKE '%low stock%'
    ) THEN
      -- Insert low stock notification
      INSERT INTO public.notifications (part_id, message, status)
      VALUES (
        part_record.id,
        'Low stock alert: ' || part_record.part_name || ' has only ' || part_record.quantity || ' units left (threshold: ' || part_record.min_threshold || ')',
        'unread'
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create function to get low stock parts
CREATE OR REPLACE FUNCTION get_low_stock_parts()
RETURNS TABLE (
  id BIGINT,
  part_name TEXT,
  part_number TEXT,
  quantity INTEGER,
  min_threshold INTEGER,
  supplier_name TEXT,
  supplier_contact TEXT,
  last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.part_name, p.part_number, p.quantity, p.min_threshold, 
         p.supplier_name, p.supplier_contact, p.last_updated
  FROM public.parts p
  WHERE p.quantity <= p.min_threshold
  ORDER BY (p.quantity::FLOAT / p.min_threshold::FLOAT) ASC;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO public.parts (part_name, part_number, quantity, min_threshold, supplier_name, supplier_contact) VALUES
('Brake Pads - Front', 'BP-001', 15, 10, 'AutoParts Express', '+1-555-0101'),
('Engine Oil Filter', 'EF-002', 25, 15, 'FilterMax Inc', '+1-555-0102'),
('Air Filter', 'AF-003', 8, 12, 'CleanAir Co', '+1-555-0103'),
('Spark Plugs', 'SP-004', 30, 20, 'Ignition Pro', '+1-555-0104'),
('Radiator Coolant', 'RC-005', 5, 8, 'CoolFlow Ltd', '+1-555-0105');

-- Trigger initial stock check
SELECT check_stock_levels();