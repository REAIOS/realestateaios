import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://btvlmnjrtugepuawwurg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0dmxtbmpydHVnZXB1YXd1dXJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk5ODQxMywiZXhwIjoyMDY0NTc0NDEzfQ.b1F79ybhtVW7wsqtvWrJJl-SM3NtcE28tsGkJaI-Ghc'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Only POST allowed');

  const { event, user_email } = req.body;

  console.log('📩 Webhook received:', req.body);

  if (event === 'checkout.successful' && user_email) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_paid: true })
      .eq('email', user_email.toLowerCase());

    if (error) {
      console.error('❌ Supabase update error:', error);
      return res.status(500).send('Failed to update profile');
    }

    return res.status(200).send('✅ User marked as paid');
  }

  return res.status(400).send('Invalid or missing webhook payload');
}
