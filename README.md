## Mobile Nested Menu Drawer

This project now showcases a mobile-focused, bottom drawer navigation pattern inspired by the reference shots you shared. Tapping the `Open Menu` pill animates a rounded sheet from the bottom of the viewport and reveals a list of sections. Items with children reveal another nested list, and the inline “Back” button lets you move up one level at a time.

The drawer is implemented entirely in `app/page.tsx`, where the `menuCatalog` array drives the hierarchy.

### Running the demo

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) on a mobile device or narrow browser viewport to feel the interaction.

### Customizing the menu

- Add, remove, or nest items by editing the `menuCatalog` constant in `app/page.tsx`. Each entry accepts an `icon`, `title`, `subtitle`, and optional `children` array for deeper nesting.
- The component is intentionally framework-agnostic beyond React hooks, so you can lift it into another page or project without additional dependencies.
- Basic animation and layout are handled with Tailwind utility classes inside `app/page.tsx` and the default `app/globals.css`.

### Notes

- The drawer supports dismissing via the scrim, the close button, or swiping down (because it is positioned at the bottom with native scrolling).
- A “Last selection” chip appears under the trigger button so you can confirm which leaf item was tapped last.
