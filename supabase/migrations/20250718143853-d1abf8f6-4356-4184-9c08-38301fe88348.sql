-- Add card-specific columns to receipts table
ALTER TABLE public.receipts 
ADD COLUMN card_brand TEXT,
ADD COLUMN card_last_digits TEXT,
ADD COLUMN card_installments INTEGER DEFAULT 1;