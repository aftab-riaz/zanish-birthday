/**
 * ✨ A Little Magic for Hurriya — central content configuration.
 *
 * Every piece of text in the experience lives here. Change `name` and the
 * whole site updates. Messages, the letter, and music settings are below.
 */

const name = "Hurriya";
const birthdayDate = "October 22";

export type SceneId = "gift" | "cake" | "garden" | "letter" | "finale";

export const SCENE_ORDER: readonly SceneId[] = [
  "gift",
  "cake",
  "garden",
  "letter",
  "finale",
] as const;

export const birthdayConfig = {
  name,
  birthdayDate,
  relationship: "friend",
  theme: "dreamy",

  /**
   * Music is always muted until the visitor taps the music button — browsers
   * block audible autoplay anyway. If set to `true`, music starts on the
   * visitor's first tap anywhere on the page.
   */
  musicEnabledByDefault: false,

  music: {
    /**
     * Path to your own licensed track inside /public, e.g. "/audio/background.mp3".
     * Leave as `null` to use the built-in generated music-box melody
     * (a soft, synthesized "Happy Birthday" — no audio file needed).
     */
    src: null as string | null,
    volume: 0.45,
  },

  meta: {
    title: `Happy Birthday, ${name} ✨ | A Little Surprise`,
    description: `A little corner of the internet made just for ${name}. Open it when you're ready ✨`,
    shareTitle: `A little surprise for ${name} ✨`,
    shareText: `Someone made a little birthday surprise for ${name} ✨`,
  },

  loading: {
    message: `Preparing a little magic for ${name}...`,
  },

  progressLabels: {
    gift: "The surprise",
    cake: "The celebration",
    garden: "The garden",
    letter: "The letter",
    finale: "The finale",
  } satisfies Record<SceneId, string>,

  gift: {
    eyebrow: "A little surprise",
    greeting: `Hey ${name}...`,
    line1: "Someone made a little something just for you.",
    line2: "Ready to see what's inside?",
    button: "Open Your Surprise",
    hint: "Tap the gift to open",
  },

  cake: {
    eyebrow: `${birthdayDate} · a day all about you`,
    heading: `Happy Birthday, ${name}!`,
    subheading: "Today is all about celebrating someone wonderful — you.",
    wishButton: "Make a Wish",
    wishPrompt: "Close your eyes… and make a wish",
    message:
      "May this new chapter bring you beautiful surprises, unforgettable moments, and countless reasons to smile.",
    more: "There's more waiting for you...",
    continueButton: "Continue the Magic",
  },

  garden: {
    eyebrow: "A little garden of wishes",
    heading: "A Few Things Worth Celebrating",
    subheading: "Some people deserve a little extra happiness on their special day.",
    hint: "Tap the glowing things in the garden",
    emptyMessage: "Each glowing thing is holding a little wish for you…",
    messages: [
      "Here's to all the little moments that make life beautiful.",
      "May your smile always find new reasons to shine.",
      "I hope this year brings you exciting adventures.",
      "May you be surrounded by kindness, laughter, and good people.",
      "And may the best surprises still be ahead of you.",
    ],
    complete: "One more thing I wanted to say...",
    continueButton: "Read Your Letter",
    skipButton: "Skip to your letter",
  },

  letter: {
    eyebrow: "Sealed with care",
    envelopeLabel: `To ${name}, with warm wishes`,
    hint: "Tap the seal to open",
    openButton: "Open the letter",
    closeButton: "Fold the letter",
    greeting: `Dear ${name},`,
    opener: "Happy Birthday! 🎂",
    paragraphs: [
      "I wanted to do something a little different this year, so instead of sending just another birthday message, I made this little corner of the internet especially for you.",
      "I hope your day is filled with laughter, beautiful moments, and all the happiness you deserve.",
      "May this new year of your life bring you exciting opportunities, wonderful experiences, and memories that make you smile whenever you look back.",
      "Keep being yourself, keep chasing the things that make you happy, and never forget how much joy the little things in life can bring.",
      "Wishing you a truly beautiful birthday and an even better year ahead.",
      `Happy Birthday once again, ${name}! ✨`,
    ],
    closing: "From your friend,",
    signature: "Someone who wanted to make your day a little more special.",
    continueButton: "One Last Surprise",
  },

  finale: {
    heading: `The World Is a Little Brighter With You In It, ${name}.`,
    subheading:
      "May your wishes find their way to the stars, and may this year give you a thousand beautiful reasons to smile.",
    birthdayLine: `Happy Birthday, ${name}!`,
    sparkleButton: "Make the Sky Sparkle",
    sparkleAgainButton: "Sparkle Once More",
    finalMessage: "Here's to a wonderful year ahead! 🎉",
    footer: "Made with a little creativity and a lot of good wishes.",
    replayButton: "Experience Again",
    shareButton: "Share This Surprise",
    copied: "Link copied — share the magic ✨",
    shareFailed: "Couldn't share automatically — copy the link from your address bar.",
  },
} as const;

export type BirthdayConfig = typeof birthdayConfig;
