/* Chase Account 2.0 — shared read-only identity adapter.
 * Pass the application's existing authenticated Supabase client.
 * Never use this client-side result as authorization for privileged operations.
 */
export async function loadChaseAccount(client) {
  const {data: auth,error: authError}=await client.auth.getUser();
  if(authError) throw authError;
  if(!auth?.user) return null;
  const {data,error}=await client.from('chase_identity_entitlements')
    .select('edition,company_role,lifetime_chase_plus,family_access,full_product_access,game_beta_access,gold_trim,email_status')
    .eq('user_id',auth.user.id).maybeSingle();
  if(error) throw error;
  return {id:auth.user.id,email:auth.user.email,edition:data?.edition??null,
    role:data?.company_role??'member',lifetimeChasePlus:data?.lifetime_chase_plus===true,
    familyAccess:data?.family_access===true,fullProductAccess:data?.full_product_access===true,
    gameBetaAccess:data?.game_beta_access===true,goldTrim:data?.gold_trim===true,
    emailStatus:data?.email_status??'unchanged'};
}
export const chaseAccountLabels=Object.freeze({community:'Chase Community',prime:'Chase Prime',royal:'Chase Royal',vanguard:'Chase Vanguard',studio:'Chase Studio'});
