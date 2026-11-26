# The Official Sajji Summons 🍗

A single, funny, premium page that asks **Muqadas Islam** one very important
question: *"Will you treat us to Sajji?"* Built with Next.js (App Router),
TypeScript, Tailwind CSS v4, Motion for React and canvas-confetti.

- **The question:** the "No" button runs away (on hover, or on every tap on phones) and
  changes its excuse each time, while "Yes" keeps getting bigger. After 10 escapes it gives
  up and turns into "Okay fine, YES 😤".
- **Deal sealed:** confetti, an "Approved" stamp, the Fine Print, a feast-day picker and
  a "Confirm on WhatsApp" button with a pre-written confirmation message.

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
| Name and every line of text | `src/config/sajji.ts` |
| Colors & fonts | `src/app/globals.css` (`@theme`) and `src/app/layout.tsx` |
| The Sajji illustration | `src/components/sajji/SajjiArt.tsx` |
| Link preview image (WhatsApp etc.) | `src/app/opengraph-image.tsx` |

## Deploy to Vercel

1. Create an empty repository on GitHub (e.g. `sajji-summons`).
2. Push this project:
   ```bash
   git init && git add -A && git commit -m "Sajji summons"
   git branch -M main
   git remote add origin https://github.com/<you>/sajji-summons.git
   git push -u origin main
   ```
3. On [vercel.com/new](https://vercel.com/new), import the repository.
4. Keep the detected **Next.js** preset and the default build settings, then click **Deploy**.
   You don't need any environment variables. If you use a custom domain, you can optionally set
   `NEXT_PUBLIC_SITE_URL=https://your-domain` so link previews use it.
5. Open the production URL and try to press "No" a few times.
6. Open it on a real phone and check the whole flow. Also paste the
   link into WhatsApp or iMessage to see the preview card.
