## Mobile Nested Menu Drawer

This project now showcases a mobile-focused, bottom drawer navigation pattern. Tapping the `Open Menu` pill animates a rounded sheet from the bottom of the viewport and reveals a list of sections. Items with children reveal another nested list, and the inline “Back” button lets you move up one level at a time. The drawer now includes:

- Direction-aware slide animations for every level change (forward/back)
- Mouse/touch drag handle so you can pull the sheet down or nudge it upward with natural resistance
- Full keyboard and screen-reader support: focus trap, arrow navigation, ARIA roles, and ESC-to-dismiss
- Responsive layout that adapts to long lists via a capped, scrollable region
- Smooth 60fps transitions with reduced-motion fallbacks for accessibility
- Clean hover/focus treatments plus history-managed breadcrumbs

### Running the demo

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) on a mobile device or narrow browser viewport to feel the interaction.

### Component usage

`app/components/NestedMenuDrawer.tsx` contains a reusable component, while `app/lib/menuData.ts` holds the menu structure and shared `MenuItem` type. Supply the drawer with an array of `MenuItem` objects, control the `isOpen` state:
```tsx
import { useState, useRef } from "react";
import { NestedMenuDrawer } from "./components/NestedMenuDrawer";
import { menuCatalog, type MenuItem } from "./lib/menuData";

const Example = () => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <button
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
      >
        Open Menu
      </button>

      <NestedMenuDrawer
        menu={menuCatalog}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        triggerRef={triggerRef}
      />
    </>
  );
};
```

### Menu data structure

```ts
import type { LucideIcon } from "lucide-react";

export type MenuItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children?: MenuItem[]; // optional nested entries
};
```

Add, remove, or nest items by editing the `menuCatalog` constant in `app/lib/menuData.ts`. Each entry accepts an `icon`, `title`, `subtitle`, and optional `children` array for deeper nesting.

### Customization tips

- Visual styling relies on Tailwind utility classes plus a few custom keyframes in `app/globals.css`. Adjust spacing, colors, or animation timings there.
- The drawer exposes `onOpenChange`, so you can control it from context, Redux, or any state manager.
- Provide your own icons by swapping in any Lucide component (or custom React node) for the `icon` field on each menu item.
- Drag behavior is governed by the `MAX_UPWARD_DRAG`, `DEFAULT_MAX_DOWNWARD_DRAG`, and `CLOSE_THRESHOLD_PX` constants in `app/page.tsx`.
- Icons are powered by [`lucide-react`](https://github.com/lucide-icons/lucide); swap them by importing the icon you want inside `app/lib/menuData.ts` and assigning it to the `icon` field.

### Notes

- The drawer supports dismissing via the scrim, pulling the handle downward, hitting `Esc`, or programmatically toggling `isOpen`.
- Pull the top pill-shaped handle with a mouse or finger to nudge the sheet and close it when you cross the threshold.
