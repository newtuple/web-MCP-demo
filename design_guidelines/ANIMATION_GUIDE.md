# Animation Guide (GSAP + SplitType)

This project uses `gsap@3.14.2` and `split-type@0.3.4` for motion and text reveals.
Use this guide to implement stable, repeatable animations that match the style feel.

## Quick start (Next.js / React)

1) Mark the component as client-side when animating DOM nodes.
2) Use refs and `gsap.context()` to scope animations.
3) Clean up on unmount to avoid memory leaks or duplicate splits.

```tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";

export function HeroHeadline() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const split = new SplitType(root.current.querySelector(".hero-title")!, {
      types: "words",
    });

    const ctx = gsap.context(() => {
      gsap.from(split.words, {
        y: 80,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
      });
    }, root);

    return () => {
      ctx.revert();
      split.revert();
    };
  }, []);

  return (
    <div ref={root}>
      <h1 className="hero-title">Win the next decade.</h1>
    </div>
  );
}
```

## Scroll-triggered animations (optional)

If you need scroll-based reveals, GSAP includes the plugin:

```tsx
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

Then add `scrollTrigger` to any tween or timeline:

```tsx
gsap.from(".card", {
  y: 40,
  opacity: 0,
  stagger: 0.1,
  scrollTrigger: {
    trigger: ".card-grid",
    start: "top 75%",
  },
});
```

## Stability rules

- Do not split the same element multiple times. Track instances and call `split.revert()`.
- Use `gsap.context()` with a ref so cleanup is automatic.
- Prefer `useLayoutEffect` for initial layout-sensitive animations.
- For SSR safety, guard DOM access with `if (!ref.current) return;`.
- Respect reduced motion using `gsap.matchMedia()` and skip heavy effects.

## Prompt templates (to request Tenex-style motion)

Use these prompts when asking for implementation help so results match the reference:

```text
Goal: replicate Tenex-style page motion.
Stack: Next.js 14, React, Tailwind.
Libraries: gsap@3.14.2, split-type@0.3.4.
Deliverable: client component code with cleanup and scoped animations.
Animations:
1) Hero headline: staggered word drop-in with easing.
2) Section titles: split words with reveal on scroll.
3) Cards: subtle slide-in + fade on scroll, staggered.
Constraints: no layout shift, support prefers-reduced-motion.
```

```text
Build a menu overlay animation:
- Use GSAP timeline for open/close.
- Animate overlay blocks with clip-path stagger.
- Fade menu items in after the blocks.
- Return React component + hook setup.
```

```text
Implement a page load transition:
- Fullscreen grid of tiles that fades out to reveal content.
- No flashes on first paint.
- Provide a small reusable component or layout-level hook.
```

## Suggested animation map (Tenex-like)

- Hero text: SplitType + GSAP staggered word reveal.
- Section headers: SplitType + ScrollTrigger fade/slide.
- Cards: GSAP `from` with slight Y offset, staggered.
- Menu overlay: GSAP timeline with clip-path blocks.
- Page transition: GSAP staggered opacity grid.
- Slider: keep Swiper for swipe behavior; animate headings with GSAP.
