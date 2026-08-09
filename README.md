# Roadside ResQ

Build ROADRESQ, a premium hackathon-ready full-stack responsive web app for emergency roadside assistance. Create the complete working MVP now. Premium automotive-tech aesthetic: near-black charcoal, warm white, restrained electric-lime accent, subtle glass panels/fine borders, soft gradients used sparingly, generous whitespace, polished motion. Typography: Space Grotesk headings + Inter body (or closest high-quality web font). Lucide icons. No cheesy stock imagery, no excessive neon, no clutter.

Product promise: 'Stranded? Help is already on the way.' Connect stranded drivers to nearby verified mechanics/mobile garages.

Build these functional flows:
- Landing page: premium nav/logo ROADRESQ, Services, How it works, For mechanics, CTA Get roadside help. Hero with emergency request panel, vehicle type, issue, location and CTA. Trust metrics. Designed map-like panel with mechanic pins and cards.
- Request Help flow: vehicle type, issue category, symptom description, location, optional photo placeholder, phone; validation; matching/loading state; nearby mechanic cards with distance, rating, ETA, services, availability and Request help.
- Tracking flow: Request received -> Mechanic assigned -> En route -> Arrived -> Completed. Mechanic profile, ETA, estimate, call/message actions, safety tips.
- Mechanic dashboard demo: incoming requests, active job, availability toggle, stats, accept/reject/status controls.
- AI Breakdown Assistant: symptom input, deterministic demo intelligence that returns likely issue category, urgency, immediate safe steps, recommended service and nearby service type. Clearly avoid medical-like certainty; phrase as likely/possible and advise professional inspection.
- Footer.

Use realistic mock data and localStorage for a persistent demo request. Add routing/navigation, form validation, toasts, transitions, mobile nav, responsive layouts, loading/empty states. Backend-ready structure; database not necessary if it slows delivery. The demo path must be flawless: Landing -> Get roadside help -> issue -> find nearby help -> track mechanic. Make the copy concise, credible and premium, not generic startup filler. Ensure compile/build succeeds and preview works. Prioritize visual quality and complete interaction over unnecessary complexity.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/45cafd86-7470-4f05-83d5-d9a840cfa18c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
