/*
  # Create waitlist table

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `source` (text) - tracks where the signup came from
  2. Security
    - Enable RLS on `waitlist` table
    - Add policy for service role access
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  source text DEFAULT 'unknown'
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert and read waitlist entries
CREATE POLICY "Service role can manage waitlist"
  ON waitlist
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);