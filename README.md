# A Little Magic for Hurriya ✨

A five-scene interactive birthday surprise, built with Next.js (App Router),
TypeScript, Tailwind CSS v4, Motion for React, Lucide and canvas-confetti.

1. **A Little Surprise For You**: an illustrated gift that unties, opens and pours out light
2. **Happy Birthday, Hurriya**: a three-tier cake. Make a wish, the candles go out, confetti falls
3. **A Few Things Worth Celebrating**: a garden with five wishes (rose, star, envelope, butterfly, dandelion)
4. **A Letter for Hurriya**: a wax-sealed envelope that opens into a stationery letter
5. **The Magical Finale**: a night sky with a moon and shooting stars, plus replay and share

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build && npm start
```

## Customize

| What | Where |
| --- | --- |
| Her name (updates everywhere) | `src/config/birthday.ts`, `const name` |
| Date, all scene text, garden wishes, the letter | `src/config/birthday.ts` |
| Background music | `public/audio/` + `music.src` in the config (see `public/audio/README.md`) |
| Colors & fonts | `src/app/globals.css` (`@theme`) and `src/app/layout.tsx` |
| Social preview image | `src/app/opengraph-image.tsx` |

Music is **muted by default** and never autoplays. The built-in music box
plays a synthesized version of the public-domain "Happy Birthday" melody. The
small gift, candle, letter and sparkle chimes are synthesized too, and you only
hear them once music is turned on.

## Deploy to Vercel

1. Create an empty repository on GitHub (e.g. `zanish-birthday`).
2. Push this project:
   ```bash
   git init && git add -A && git commit -m "A little magic for Hurriya"
   git branch -M main
   git remote add origin https://github.com/<you>/zanish-birthday.git
   git push -u origin main
   ```
3. On [vercel.com/new](https://vercel.com/new), import the repository.
4. Keep the detected **Next.js** preset and the default build settings, then click **Deploy**.
   You don't need any environment variables. If you use a custom domain, you can optionally set
   `NEXT_PUBLIC_SITE_URL=https://your-domain` so link previews use it.
5. Open the production URL and play through all five scenes.
6. Open it on a real phone, ideally the kind she uses, and check the whole flow. Also paste the
   link into WhatsApp or iMessage to see the preview card.
