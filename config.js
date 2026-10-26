/* Settings for Theo's Sydney. Safe to be public: the publishable key only
   allows what the database rules in setup/supabase-setup.sql allow. */
window.THEO_CONFIG = {
  supabaseUrl: "https://valtzkoovhajgouojerj.supabase.co",
  supabaseKey: "sb_publishable_FoCWdi4djBxPsvbc251RfA_ahJjRylG",

  // Leave empty: the WhatsApp invite link is kept in Supabase behind the secret word
  // (see setup/whatsapp-link.sql), so it isn't visible in these public files.
  whatsapp: "",

  covenName: "The Coven & Co.",

  // The welcome letter Theo sees the first time she opens the map
  intro: `The Coven has gathered, the candles are lit, and we've cast a little spell over Sydney just for you.

Hidden around the city are spots full of magic: cafes, tiny bars, rock pools, sunsets and treasure shops. Each one holds a sealed spell from one of us, and you break the seal when you get there.

Choose a quest when you've got a free few hours, or wander and see what you find. When you finish one, send us a note back.

New magic will appear from time to time, so keep checking in.`
};
