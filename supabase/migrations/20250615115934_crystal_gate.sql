/*
  # Create user prompts table

  1. New Tables
    - `user_prompts`
      - `id` (uuid, primary key)
      - `original_prompt` (text) - the user's original prompt
      - `enhanced_prompt` (text) - the enhanced prompt sent to DALL-E
      - `revised_prompt` (text) - DALL-E's revised prompt
      - `style` (text) - the selected style
      - `product_color` (text) - the product color
      - `quality` (text) - standard or hd
      - `success` (boolean) - whether generation was successful
      - `error_message` (text) - error message if failed
      - `image_url` (text) - generated image URL
      - `user_session` (text) - anonymous session identifier
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on `user_prompts` table
    - Add policy for service role access
    - Add policy for anonymous users to insert their own prompts
*/

CREATE TABLE IF NOT EXISTS user_prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_prompt text NOT NULL,
  enhanced_prompt text,
  revised_prompt text,
  style text NOT NULL,
  product_color text NOT NULL,
  quality text DEFAULT 'standard',
  success boolean DEFAULT false,
  error_message text,
  image_url text,
  user_session text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_prompts ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage all prompts
CREATE POLICY "Service role can manage user prompts"
  ON user_prompts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to insert prompts with their session ID
CREATE POLICY "Users can insert their own prompts"
  ON user_prompts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow users to read their own prompts based on session
CREATE POLICY "Users can read their own prompts"
  ON user_prompts
  FOR SELECT
  TO anon
  USING (user_session = current_setting('request.jwt.claims', true)::json->>'session_id');