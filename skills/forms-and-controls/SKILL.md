---
name: forms-and-controls
description: "inputs, buttons and form behavior that works on real devices: labels, input types and inputmode, autocomplete tokens, password manager compatibility, the ios zoom rule, decorations inside a field, keyboard submission, disabling after submit without losing the button, destructive confirmation, dead zones on checkboxes and radios, and where validation errors belong. use when building or reviewing any form, input, button or control, or when a form works on desktop and fails on a phone. triggers on: input, label, placeholder, autocomplete, inputmode, enterkeyhint, password manager, 1password, ios zoom, 16px font size, autofocus, form submit, enter key, disabled button, double submit, destructive action, confirm dialog, checkbox, radio, dead zone, validation, error message, aria-invalid."
---

# forms and controls

forms are where an interface meets the messiest part of the platform: native
controls, password managers, mobile keyboards, autofill, and people who type
faster than your validation.

## inputs

### every input has a real label

```tsx
<label htmlFor={id}>Email</label>
<input id={id} type="email" />
```

or wrap it, which needs no id at all:

```tsx
<label>
  Email
  <input type="email" />
</label>
```

**a placeholder is not a label.** it disappears the moment someone types, so
the field loses its name exactly when the person needs to check what they are
filling in. it also fails at low contrast by default, and screen reader
support for placeholder-as-name is inconsistent.

if the design has no room for a visible label, use a visually hidden one. the
field still needs a name.

```tsx
<label htmlFor={id} className="sr-only">Search</label>
```

`aria-label` is the fallback when there is genuinely no text to associate. a
real `<label>` is better because it also makes the label a click target that
focuses the field.

placeholders are for **format examples**, not names. "name@company.com" is a
good placeholder. "Email" is a label pretending to be one.

### type and inputmode

`type` controls validation, autofill and the mobile keyboard. `inputmode`
controls only the keyboard, and it is the escape hatch when the type you want
for the keyboard is wrong for the semantics.

| field | type | inputmode |
| --- | --- | --- |
| email | `email` | inherited |
| phone | `tel` | inherited |
| url | `url` | inherited |
| numeric code | `text` | `numeric` |
| quantity | `number` | inherited |
| card number | `text` | `numeric` |
| search | `search` | inherited |

**do not use `type="number"` for anything that is not a quantity.** it strips
leading zeros, accepts exponent notation, adds spinner buttons nobody wants,
and on some browsers silently discards a value it cannot parse. card numbers,
postcodes, otp codes and phone numbers are all text with a numeric inputmode.

`enterkeyhint` labels the submit key on mobile and costs one attribute:

```tsx
<input enterKeyHint="search" />   {/* enter | done | go | next | previous | search | send */}
```

### autocomplete is not optional

```tsx
<input type="email" name="email" autoComplete="email" />
<input type="password" autoComplete="current-password" />
<input type="password" autoComplete="new-password" />
```

the tokens are specified, and browsers and password managers rely on them
exactly. `current-password` and `new-password` are the pair that matters most:
they tell a password manager whether to offer a saved credential or to offer
to generate one. getting these wrong is why a login form fails to autofill and
a signup form fails to save.

for addresses and names, use the full token set: `given-name`, `family-name`,
`address-line1`, `postal-code`, `cc-number`. `autocomplete="off"` is ignored by
most browsers for these anyway, and where it is honored it usually just makes
the form worse.

`spellcheck="false"` belongs on names, emails, usernames, codes and anything
that is not prose. the red squiggle under a correctly typed surname is noise.

### password managers need a form and a username field

a password field with no adjacent username field and no `<form>` wrapper is a
field most managers will not save. even in a multi-step flow where the email
was collected on a previous screen, include a hidden username field so the
manager can associate the two:

```tsx
<input
  type="text"
  name="username"
  autoComplete="username"
  value={email}
  readOnly
  hidden
/>
```

also: do not block paste. blocking paste into a password field is a security
theater pattern that breaks every password manager and pushes people toward
weaker passwords they can type.

### the ios zoom rule

**an input with a computed font size under 16px causes ios safari to zoom the
page on focus.** the zoom does not undo itself, so the reader is left at the
wrong scale, usually with the form off screen.

there is no way to opt out that is worth taking: `user-scalable=no` in the
viewport meta disables pinch zoom entirely, which is an accessibility failure.

so: **16px minimum on every focusable input on mobile.** if the design calls
for smaller, scale it up at the breakpoint.

```css
input, select, textarea { font-size: 16px; }
@media (min-width: 768px) { input, select, textarea { font-size: 0.875rem; } }
```

### decorations inside a field

an icon or a suffix inside an input must not sit on top of the text.

```tsx
<div className="relative">
  <SearchIcon
    aria-hidden="true"
    className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
  />
  <input className="pl-9" />
</div>
```

two details. **`pointer-events-none`** on the decoration, or clicking the icon
does not focus the field, which is exactly where people click. and the padding
on the input has to actually clear the icon, or long values slide underneath
it.

for an interactive decoration, a clear button or a visibility toggle, it needs
to be a real `<button type="button">` with an accessible name. `type="button"`
is required: a bare button inside a form submits it.

### autofocus, rarely

autofocus is correct when the page exists to do one thing and that thing is
the field: a search page, a login page, a single-field modal.

it is wrong on a long form, because it scrolls the page to the field and past
whatever explains the form. it is wrong on mobile in most cases, because it
opens the keyboard over half the screen before the reader has read anything.
and it is wrong on any page with content above the field.

when in doubt, do not.

## buttons

### use the right element

```tsx
<button type="button" onClick={...}>Save</button>   {/* an action */}
<a href="/settings">Settings</a>                    {/* a navigation */}
```

a `<div onClick>` is not a button. it is missing keyboard activation, focus,
the button role, and the browser's own behaviors around forms. if you must use
a non-button element, it needs `role="button"`, `tabIndex={0}`, and handlers
for both enter and space, at which point you have reimplemented `<button>`
badly.

**`type` is required on every button inside a form.** the default is `submit`,
so a button intended to open a dropdown will submit the form instead. this is
one of the most common form bugs there is.

### pointer cursor

if it can be clicked, the cursor must say so. this is the cheapest affordance
available and its absence reads as broken long before anyone can say why.

tailwind v4 changed this: v3's preflight gave `button` a pointer cursor, v4
follows the browser default of `default`. every button in a v4 project is
silently wrong until it is put back.

fix it once, globally, covering custom controls too:

```css
@layer base {
  button:not(:disabled),
  [role="button"]:not([aria-disabled="true"]),
  [role="tab"],
  [role="menuitem"],
  summary,
  label[for],
  select:not(:disabled),
  a[href] {
    cursor: pointer;
  }

  button:disabled,
  [aria-disabled="true"] {
    cursor: not-allowed;
  }
}
```

`not-allowed` on disabled, never `pointer`. pointing at something that will not
respond is worse than no affordance at all.

### submitting

a form submits on enter from any single-line input inside it. that is standard
behavior people rely on, and it only works if there is a real `<form>` with a
real submit button. a form whose only button is `type="button"` with an
onClick will not submit on enter.

for a textarea, enter inserts a newline. if the textarea should submit, use
cmd or ctrl plus enter and say so in the ui.

### disabling after submit

a double submit is a real bug and disabling the button is the right fix. two
things to get right.

**keep the width.** a button that changes from "Create account" to "Creating"
resizes, and everything beside it moves. reserve the width, or render the
label invisibly under the spinner.

```tsx
<button disabled={pending} className="relative">
  <span className={pending ? "invisible" : undefined}>Create account</span>
  {pending && <Spinner className="absolute inset-0 m-auto" />}
</button>
```

**announce the state change.** a disabled button with a spinner says nothing to
a screen reader. `aria-busy` on the form, or a live region with the status.

do not disable the submit button because the form is invalid. it gives no
reason, and it leaves people clicking a dead control with no idea what is
wrong. let them submit, then show the errors.

### keyboard shortcuts on buttons

if a button has a shortcut, show it in the button, and register it in one
place rather than in the component:

```tsx
<button>
  Save
  <kbd className="text-muted-foreground ml-2 text-xs">Cmd S</kbd>
</button>
```

a shortcut nobody can discover is a shortcut nobody uses.

## destructive actions

three levels, and picking the wrong one is a design failure in both
directions.

| risk | pattern |
| --- | --- |
| reversible | do it, offer undo in a toast |
| irreversible, low cost | confirm dialog with a named action |
| irreversible, high cost | confirm by typing the name, or hold to confirm |

**undo beats confirm** wherever it is possible. a confirm dialog interrupts
every deletion including the hundreds that were intended, to catch the rare
one that was not. undo interrupts none of them.

when a dialog is required, the confirm button says what it does. "Delete
project" not "OK". and the destructive button is not the default focus target.

for the high-cost case, a hold-to-confirm button is a good pattern with one
requirement: the fill is the entire affordance and it says nothing to a screen
reader, so the requirement has to be spoken.

```tsx
<span id={hintId} hidden>
  Press and hold for {seconds} seconds to confirm.
</span>
```

with `aria-describedby={hintId}` on the button. without it, the control
announces as an ordinary button and a press that appears to do nothing is
indistinguishable from one that is broken.

## checkboxes, radios and dead zones

a checkbox is a 16px target. the label beside it is a 200px target. if the
label is not wired up, the reader has to hit the 16px box, and on a phone they
will miss.

```tsx
<label className="flex cursor-pointer items-center gap-2 py-2">
  <input type="checkbox" />
  <span>Email me about updates</span>
</label>
```

the wrapping label makes the whole row a target. the `py-2` gets the row to a
44px height without changing the visual design.

the dead zone to watch for: a gap between the control and its label that is
inside neither. it looks clickable, it is not, and it is the single most
common reason a checkbox feels broken. keep the label and the control inside
one element and let the gap be padding rather than margin.

a radio group needs a `fieldset` and a `legend`, or a `role="radiogroup"` with
a label. without it, the group has no name and the options are announced
without their question.

## validation and errors

**validate on blur, not on every keystroke.** telling someone their email is
invalid while they are on the third character is wrong and it is annoying.
once a field has been marked invalid, then revalidate on change, so the error
clears as soon as they fix it.

**the error goes next to the field**, is associated with it, and says what to
do:

```tsx
<input
  aria-invalid={error ? true : undefined}
  aria-describedby={error ? errorId : undefined}
/>
{error && (
  <p id={errorId} className="text-destructive text-sm">
    {error}
  </p>
)}
```

`aria-invalid` and `aria-describedby` are what make the error reach a screen
reader at all. a red border alone communicates nothing to anyone not looking
at it, and nothing to anyone who cannot distinguish the color.

**on submit, focus the first invalid field.** a form that scrolls to an error
is better than one that does not, and a form that focuses it is better than
one that scrolls.

**never rely on color alone.** the error needs text. the required marker needs
more than a red asterisk.

server errors that are not about one field go in a summary at the top of the
form, in a live region, so they are announced rather than silently appearing.

## checklist

- [ ] every input has a real label, placeholders are format examples only
- [ ] correct `type` plus `inputmode`, no `type="number"` for codes
- [ ] `autocomplete` tokens on every field a manager should fill
- [ ] a `<form>` wrapper and a username field wherever there is a password
- [ ] paste not blocked
- [ ] 16px minimum font size on inputs at mobile widths
- [ ] decorations `pointer-events-none`, padding clears them
- [ ] `type` set explicitly on every button inside a form
- [ ] pointer cursor restored globally, `not-allowed` on disabled
- [ ] submit button keeps its width while pending, and announces it
- [ ] submit not disabled merely because the form is invalid
- [ ] undo preferred over confirm where the action is reversible
- [ ] labels wrap their checkbox, no dead zone in the gap
- [ ] validate on blur, revalidate on change
- [ ] errors linked with `aria-invalid` and `aria-describedby`
- [ ] first invalid field focused on submit
