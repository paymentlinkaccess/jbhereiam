// JB Daily Feed uses the same Supabase project as Private Gallery,
// but separate tables, storage and Stripe subscription verification.
export const JB_FEED_CONFIG = {
  supabaseUrl: 'https://vvavsherdpabfdoskdfo.supabase.co',
  supabasePublishableKey: 'sb_publishable_tpRYqaEWPQEIHhDuM-7MEA_l5pb82Nx',
  stripeSubscriptionUrl: 'https://buy.stripe.com/00w28r1u58Wk5hAd4m7kc0p',
  tablePosts: 'jb_feed_posts',
  tableMemberships: 'jb_feed_memberships',
  storageBucket: 'jb-feed-media',
  accessFunction: 'jb_has_daily_feed_access'
};
