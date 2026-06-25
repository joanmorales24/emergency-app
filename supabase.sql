-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cedula_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  age_approximate INT NOT NULL,
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  contact_whatsapp VARCHAR(20),
  status VARCHAR(20) NOT NULL DEFAULT 'alive',
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster searches
CREATE INDEX idx_reports_cedula_hash ON reports(cedula_hash);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read all reports
CREATE POLICY "Allow public read access" ON reports
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert reports
CREATE POLICY "Allow public insert" ON reports
  FOR INSERT
  WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT ON reports TO anon;
GRANT SELECT, INSERT ON reports TO authenticated;
