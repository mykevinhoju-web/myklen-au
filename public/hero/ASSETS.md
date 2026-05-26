# Hero media (must be in Git for Vercel)

The homepage hero video is **not** missing from the app code — these files must be **committed and pushed** or `myklen.com.au` cannot serve them.

| File | Used for |
|------|----------|
| `hero-scene.mp4` | Desktop hero video (source: `running.mp4`, ~8MB) |
| `hero-scene-mobile.mp4` | Mobile hero video (same file as desktop) |

After replacing either MP4, bump `HERO_VIDEO_CACHE_VERSION` in `src/components/hero-video-scroll.tsx` so live browsers fetch the new file.
| `hero-poster.png` / `hero-bg.png` | Poster while video loads; reduced-motion fallback |
| `logo-frames.png` | Legacy sprite (header now uses `public/brand/myklen-logo.png`) |
| `about-building.png` | About section background |

After adding files: `git add public/hero` → commit → push → Vercel redeploy.
