# Background music

By default the site plays a soft, **generated music-box "Happy Birthday"**
(synthesized in the browser — no file needed), and only after the visitor taps
the music button.

To use your own track instead:

1. Put a file you have the rights to use in this folder, e.g. `background.mp3`
   (MP3 or M4A for best iPhone support; keep it under ~3 MB).
2. In `src/config/birthday.ts` set:

   ```ts
   music: { src: "/audio/background.mp3", volume: 0.45 },
   ```

If the file is missing or can't play, the site automatically falls back to the
music box, so the button never breaks.
