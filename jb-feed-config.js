// JB Daily Feed: separate member database from Private Gallery.
export const JB_FEED_CONFIG = {
  supabaseUrl: '',
  supabasePublishableKey: '',
  stripeSubscriptionUrl: 'https://buy.stripe.com/00w28r1u58Wk5hAd4m7kc0p',
  tablePosts: 'jb_feed_posts',
  tableMemberships: 'jb_feed_memberships',
  storageBucket: 'jb-feed-media',
  accessFunction: 'jb_has_daily_feed_access'
};
