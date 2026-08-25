# Playground Components vs shadcn/ui

This document compares the hand-built components in this folder to their shadcn/ui counterparts (Dialog and Tabs).

---

## Modal.tsx vs shadcn/ui Dialog

### What My Component Covers
- Basic `role="dialog"` and `aria-modal="true"`
- Focus trapping within the modal
- Escape key to close
- Focus return to trigger element on close
- Click outside to close (backdrop)
- `aria-labelledby` and `aria-describedby` for screen reader announcements

### Gaps Compared to shadcn/ui

1. **Missing `aria-describedby` auto-wiring**
   shadcn/ui Dialog automatically associates the description with the dialog using `aria-describedby`. My implementation requires manual passing of `description` prop and doesn't handle cases where multiple descriptive elements exist. shadcn/ui also handles the edge case where description is empty by not adding the attribute at all.

2. **No `inert` attribute support**
   shadcn/ui marks elements outside the dialog as `inert` when the dialog is open, preventing screen readers from accessing background content. My implementation only hides the body scroll but doesn't prevent screen reader navigation to background elements. This is a significant accessibility gap for assistive technology users.

3. **Missing nested dialog handling**
   shadcn/ui properly manages focus when multiple dialogs are stacked (e.g., a confirmation dialog inside an edit dialog). My implementation doesn't track a dialog stack, so nested modals can cause focus management issues.

4. **No animation accessibility handling**
   shadcn/ui respects `prefers-reduced-motion` for dialog animations. My implementation has no animation, but if added, it would need to check for reduced motion preferences.

---

## Tabs.tsx vs shadcn/ui Tabs

### What My Component Covers
- `role="tablist"`, `role="tab"`, and `role="tabpanel"` roles
- `aria-selected` on active tab
- `aria-controls` linking tabs to panels
- `tabIndex` management (only active tab is focusable)
- Arrow key navigation (Left/Right)
- Home/End key support
- Manual tab registration via refs

### Gaps Compared to shadcn/ui

1. **Missing `aria-orientation` dynamic handling**
   shadcn/ui supports both horizontal and vertical tab orientations with appropriate arrow key behavior (Left/Right for horizontal, Up/Down for vertical). My implementation hardcodes horizontal orientation in `aria-orientation` attribute but the keyboard handler always uses Left/Right regardless of orientation.

2. **No automatic activation mode**
   shadcn/ui supports both "automatic" activation (focus moves and panel shows immediately) and "manual" activation (focus moves but panel only shows on Enter/Space). My implementation only supports automatic activation. Manual activation is important for tabs with expensive panel content where you don't want to load everything on hover.

3. **Missing tab data attributes for styling**
   shadcn/ui exposes `data-state="active"` and `data-state="inactive"` attributes for easy CSS styling. My implementation only uses inline styles and doesn't provide these convenient data attributes for external styling.

4. **No lazy mounting of tab panels**
   shadcn/ui can defer rendering inactive tab panels until they're first activated. My implementation renders all panels upfront (though only shows the active one), which can cause performance issues with complex panel content.

---

## Disclosure.tsx vs shadcn/ui Collapsible

### What My Component Covers
- `aria-expanded` on the trigger button
- `aria-controls` linking trigger to panel
- Enter/Space keyboard toggle
- Hidden state management
- Visual rotation indicator

### Gaps Compared to shadcn/ui

1. **Missing `aria-hidden` on panel**
   My implementation uses the `hidden` attribute but doesn't explicitly set `aria-hidden="true"` on the panel content when collapsed. While `hidden` should hide from assistive tech, explicit `aria-hidden` provides better cross-browser screen reader support.

2. **No focus management for panel content**
   shadcn/ui can optionally move focus into the panel when opened. My implementation doesn't manage focus within the panel, which could be important for complex disclosure content like forms.

3. **Missing disabled state support**
   shadcn/ui supports a `disabled` prop that prevents the disclosure from being toggled. My implementation has no disabled state.

---

## Summary

| Feature | My Component | shadcn/ui |
|---------|--------------|-----------|
| Basic ARIA roles | ✅ | ✅ |
| Keyboard navigation | ✅ | ✅ |
| Focus trapping (Modal) | ✅ | ✅ |
| `inert` attribute | ❌ | ✅ |
| Automatic/Manual activation (Tabs) | ❌ Auto only | ✅ Both |
| `data-state` attributes | ❌ | ✅ |
| Lazy panel mounting | ❌ | ✅ |
| Nested dialog support | ❌ | ✅ |
| Reduced motion handling | ❌ | ✅ |
| Disabled states | ❌ | ✅ |

These components are suitable for learning and simple use cases, but for production applications requiring comprehensive accessibility, shadcn/ui (or similar libraries that follow Radix UI primitives) provide more robust solutions.
