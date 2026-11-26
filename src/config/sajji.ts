/**
 * 🍗 The Official Sajji Summons: every word on the page lives here (Hinglish).
 */

const name = "Api";
const fullName = "Api Muqadas Islam";

export const sajjiConfig = {
  name,
  fullName,

  meta: {
    title: `Sajji Summons for ${fullName} 🍗`,
    description: `${fullName}, ek zaroori sawaal aapka intezar kar raha hai! 😏`,
  },

  ask: {
    badge: "🚨 Urgent Notice",
    greeting: `Assalam-o-Alaikum, ${fullName}! 👋`,
    intro: "Aap ne khud kaha tha:",
    quote: "“Main Sajji khila dungi!” 🍗",
    after: "Lekin uske baad… na koi date, na koi update. 👀",
    question: "Toh… Sajji treat pakki?",
    yes: "Haan, pakka! 🍗",
    hint: "Psst… “Nahi” daba ke dekho 😏",
    escapes: "Bhaagne ki koshishein",
  },

  /** The "Nahi" button changes its excuse every time it runs away. */
  noLabels: [
    "Nahi",
    "Pakka nahi? 🤨",
    "Soch lo…",
    "Sajji ro rahi hai 😢",
    "Masala lag chuka!",
    "Api please 🥺",
    "Error 404 😵",
    "Murgha bhi maan gaya",
    "Pait ro raha hai",
    "Button thak gaya 😮‍💨",
  ],
  noGiveUp: "Acha theek hai, HAAN 😤",

  /** A short reply after each escape attempt. */
  reactions: [
    "Ghalat jawab! Dobara try karo. 🤔",
    "Committee ne reject kar diya. ❌",
    "Socho: garam Sajji, extra raita. 🤤",
    "Subah se masala laga hai. Izzat do!",
    "Sirf ek Sajji hi toh maangi hai. 🙏",
    "System sirf “Haan” accept karta hai. 🤖",
    "Murghi se behes? Wah ji wah! 😂",
    "Suno… pait ki awaaz aa rahi hai.",
    "Button haar gaya. Ab aap bhi maan jao! 😌",
  ],

  yes: {
    badge: "✅ Faisla Ho Gaya",
    heading: "Deal Pakki! 🎉",
    body: "Api ne haan kar di! Screenshot le liya gaya hai. 📸",
    stamp: "Pakka",
    stampRing: "Sajji Committee · Approved · ",
    termsTitle: "Chhote se rules 📜",
    terms: ["Poori Sajji, aadhi nahi! ❌", "Naan aur raita zaroori. 🫓", "“Wallet bhool gayi” nahi chalega. 🙅"],
    whenTitle: "Treat kab hai? 📅",
    whenHint: "Ek din select karo 👆",
    whenOptions: [
      { id: "fri", label: "Jumma", date: "27 November", note: "Jumma Mubarak aur Sajji Mubarak! 🍗" },
      { id: "sat", label: "Hafta", date: "28 November", note: "Weekend ki shuruaat Sajji se! 😎" },
    ],
    again: "Dobara poocho 🔁",
  },

  thanks: {
    heading: `Shukriya, ${name}!`,
    body: "Aap sach mein best ho. Aapka dil Sajji se bhi bara hai! 😄",
    wishesTitle: "Aapke liye duaayein 🤲",
    wishes: [
      "Allah aapko hamesha khush rakhe. 😊",
      "Aapki zindagi khushiyon aur barkat se bhari rahe. ✨",
      "Aapki har dua qabool ho. 🤲",
      "Aur aap hamesha aisi hi pyaari raho! 💛",
    ],
  },

  footer: "Aapke bhai ki taraf se, pyaar ke saath 💛",
} as const;
