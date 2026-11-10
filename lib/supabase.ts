import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase URL atau Publishable Key belum diatur di .env.local"
  );
}

try {
  new URL(supabaseUrl);
} catch {
  throw new Error(
    "Supabase Project URL tidak valid. Periksa kembali .env.local"
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);