/* Settings for Theo's Sydney. Safe to be public: the publishable key only
   allows what the database rules in setup/supabase-setup.sql allow. */
window.THEO_CONFIG = {
  supabaseUrl: "https://valtzkoovhajgouojerj.supabase.co",
  supabaseKey: "sb_publishable_FoCWdi4djBxPsvbc251RfA_ahJjRylG",

  // Leave empty: the WhatsApp invite link is kept in Supabase behind the secret word
  // (see setup/whatsapp-link.sql), so it isn't visible in these public files.
  whatsapp: "",

  // Public half of the notification key (safe to share; the private half lives only in Supabase)
  pushKey: "BCfgQnU-pNiXmZ9pXqLx7BwWdfywTWywCL3-92zftJRhYxCqVz0mgBryP08NajrXZdZGrGqFDNFGQl6N7zRDG0g",

  covenName: "The Coven & Co.",

  // The welcome letter Theo sees the first time she opens the map
  // (and any time she taps "Letter" in the top bar)
  introTitle: "Hey Theo",
  intro: `The Coven has gathered and we have cast some spells to make sure Sydney turns up the magic when you get to town.

All you need do is follow the steps to collect a couple of key ingredients, making sure to cackle along the way as much as possible.

We've saved a few of our favorite spots and a few we think might become your favorites. Each comes with a cheeky little note you can unlock once you get there. There's even a few curated quests if you're ready to kill a couple hours casting spells.

Whenever you're in a need of a little magic from home, we've got something for you.

And you never know, maybe as you get ticking you'll unlock a few more spells to play with.`,
  introSignoff: `All our love and every ounce of magic we have to offer.

The Coven & Co. x`
};
