import { supabase } from '../../../lib/supabase';

export const areAllSignaturesComplete = async (conventionId: string) => {
  const { data: signatures, error } = await supabase
    .from('signatures')
    .select('*')
    .eq('convention_id', conventionId);

  if (error || !signatures) return false;

  return signatures.every(sig => sig.signature_data && sig.signed_at);
};

export const hasDirectorSigned = async (conventionId: string) => {
  const { data, error } = await supabase
    .from('signatures')
    .select('*')
    .eq('convention_id', conventionId)
    .eq('signer_role', 'chef_etablissement')
    .maybeSingle();

  if (error || !data) return false;

  return !!(data.signature_data && data.signed_at);
};

export const updateConventionStatusAfterDirectorSignature = async (conventionId: string) => {
  const allComplete = await areAllSignaturesComplete(conventionId);

  if (allComplete) {
    await supabase
      .from('conventions')
      .update({ status: 'ready_to_print' })
      .eq('id', conventionId);
  }
};
