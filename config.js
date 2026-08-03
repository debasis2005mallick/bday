// Birthday configuration for Saloni — from DEBASIS 💖
const defaultBirthdayConfig = {
  theme: "rose-gold", // royal-magic, rose-gold, neon-sunset, cozy-forest
  recipientName: "Saloni",
  recipientAge: "Birthday Girl 🎂",
  headerWishes: "Happy Birthday Saloni! 🎉",
  lockCode: "0508",
  lockHint: "Hint: Your special day 🎂 (ddmm)",

  letterTitle: "A Special Letter For You, Saloni... ✉️",
  letterContent: `Hey Saloni! 🎉\n\nHappy Birthday to the most amazing girl I know! 🎂\n\nOn this beautiful day — August 5th — I just want you to know how incredibly special you are. Your smile lights up every room you walk into, and your energy is absolutely infectious. You make every moment more special just by being in it.\n\nWatching you live your best life — dancing in the mountains, owning every spot you walk into, laughing through the neon lights — these are memories I truly treasure. You bring so much color and joy into this world, Saloni.\n\nMay this birthday be as radiant and magical as you are. May every single one of your dreams take flight this year. You deserve nothing but the absolute best — in love, in adventure, in laughter, and in every quiet moment in between.\n\nThank you for being you. Thank you for all the moments, the memories, and the magic.\n\nHere's to you, birthday girl! 🥂✨\n\nWith all my love and best wishes,\nDebasis ❤️`,

  memories: [
    {
      title: "Free Spirit ✨",
      description: "You and the mountains — arms raised, hair dancing in the wind, that beautiful smile. Pure freedom. Pure Saloni.",
      image: "photos/saloni_1.jpg"
    },
    {
      title: "Effortlessly Beautiful 🌸",
      description: "Standing tall and gorgeous in that blue floral dress. You make every background look like a photoshoot set!",
      image: "photos/saloni_2.jpg"
    },
    {
      title: "Sunshine Vibes ☀️",
      description: "Sunglasses on, looking up at the sky — as if the whole world is yours. Because it is.",
      image: "photos/saloni_3.jpg"
    },
    {
      title: "Neon Nights 💜",
      description: "Those neon lights couldn't outshine you. The most radiant person in any room, always.",
      image: "photos/saloni_4.jpg"
    },
    {
      title: "Wanderer Soul 🌍",
      description: "Owning every space, every moment. You make the ordinary extraordinary just by being there.",
      image: "photos/saloni_5.jpg"
    }
  ],

  balloonWishes: [
    "You are absolute sunshine, Saloni! 🌟",
    "May all your wildest dreams come true this year! ✨",
    "Wishing you endless giggles and adventures! 😂",
    "You deserve ALL the cake today! 🎂",
    "You are the most precious person — never forget that! 💖",
    "Here's to another magical year around the sun! ☀️",
    "May this year bring you everything your heart desires! 🎁",
    "Stay wild, stay free, stay YOU! 🦋",
    "The world is so much better with you in it! 🥰",
    "Adventure awaits — and you were made for it! 🌈",
    "Your smile is literally someone's favorite thing! 💫",
    "Happy Birthday to the girl who deserves the WORLD! 🎊"
  ],

  giftSurprise: {
    message: "🎉 You found your birthday surprise, Saloni! 🎁",
    couponTitle: "SALONI'S BIRTHDAY SPECIAL",
    couponCode: "SALONI-05-AUG-QUEEN",
    couponTerms: "Valid for: 1x Grand Birthday Adventure, Unlimited Laugh Sessions, One More Morning Ride 🌅, Infinite Good Vibes, a Lifetime of Access to Me 💖, 1x Emergency Ice Cream Call at Any Hour 🍦 — curated especially for you by Debasis. Never expires.",
    giftImageUrl: "photos/saloni_5.jpg"
  }
};

// Configuration helper functions
function getBirthdayConfig() {
  const customConfig = localStorage.getItem("birthday_surprise_config");
  if (customConfig) {
    try {
      return JSON.parse(customConfig);
    } catch (e) {
      console.error("Error parsing custom configuration, resetting to default.", e);
      return defaultBirthdayConfig;
    }
  }
  return defaultBirthdayConfig;
}

function saveBirthdayConfig(config) {
  localStorage.setItem("birthday_surprise_config", JSON.stringify(config));
}

function resetBirthdayConfig() {
  localStorage.removeItem("birthday_surprise_config");
}
