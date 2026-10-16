// JB Daily Feed configuration. Use a DIFFERENT project from Private Gallery.
// Replace these placeholders only after creating JB's separate Supabase project.
export const JB_FEED_CONFIG = {
  supabaseUrl: '',
  supabasePublishableKey: '',
  stripeSubscriptionUrl: '', // Stripe recurring $12.99/month payment link
  tablePosts: 'jb_feed_posts',
  tableMemberships: 'jb_feed_memberships',
  storageBucket: 'jb-feed-media',
  accessFunction: 'jb_has_daily_feed_access'
};
