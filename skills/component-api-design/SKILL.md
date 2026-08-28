---
name: component-api-design
description: "designing component apis other people can live with: compound components against configuration props, where to draw the customization line, prop naming and boolean conventions, event handler naming, the asChild pattern, forwarding refs and spreading rest props, controlled and uncontrolled state with a defaultValue, escape hatches, and the anti-patterns that produce a component nobody can use in the one case they need. use when designing a reusable component, reviewing a component api, or deciding whether something should be a prop or a slot. triggers on: component api, props, compound components, asChild, slot, render prop, controlled uncontrolled, defaultValue, forwardRef, spread props, className merge, cn, variant, boolean props, prop explosion, escape hatch, composition."
---

# component api design

a component api is a contract with a person who has a case you did not think
of. everything here is about leaving room for that case without making the
common one worse.

the specific failure to avoid: a component that handles nine situations
through nine props, and cannot handle the tenth at all.

## configuration or composition

**configuration** passes data and options. **composition** passes elements.

```tsx
{/* configuration */}
<Card title="Billing" description="Manage your plan" icon={<Icon />} footer={<Button />} />

{/* composition */}
<Card>
  <CardHeader>
    <Icon />
    <CardTitle>Billing</CardTitle>
    <CardDescription>Manage your plan</CardDescription>
  </CardHeader>
  <CardFooter><Button /></CardFooter>
</Card>
```

configuration is shorter and it has a ceiling. the first time someone needs a
badge beside the title, or two buttons in the footer, or the description above
the title, the api needs a new prop. do that four times and you have a
component with fourteen props and a prop for every arrangement anyone has ever
asked for.

composition has no ceiling. the cost is verbosity and the risk that the parts
can be assembled into something that looks wrong.

**the rule: configuration for things with one shape, composition for things
with many.** a `Badge` takes props. a `Card` takes children. a `Select` takes
an items array. a `Dialog` takes children.

when unsure, start with composition. adding a convenience wrapper on top of a
composable component is easy. extracting composition out of a configured
component is a breaking change.

### compound components

the composition version, with the parts sharing state through context:

```tsx
const TabsContext = React.createContext<TabsContext | null>(null)

export function Tabs({ value, defaultValue, onValueChange, children }: TabsProps) {
  const [own, setOwn] = React.useState(defaultValue)
  const active = value ?? own
  return (
    <TabsContext.Provider value={{ active, select }}>
      {children}
    </TabsContext.Provider>
  )
}

Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Panel = TabsPanel
```

**use compound components when** the parts are meaningless apart, the
arrangement varies, and the shared state is real. tabs, accordions, dialogs,
selects, menus.

**do not use them when** the component has one arrangement. a compound
`Avatar` with `Avatar.Image` and `Avatar.Fallback` is ceremony around
something that could take two props.

the context should throw a useful error when a part is used outside its root,
because the alternative is a null reference three frames later:

```tsx
function useTabs() {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("Tabs.Trigger must be used within Tabs")
  return context
}
```

## naming

### be boring and be consistent

follow the platform and the ecosystem rather than inventing. across a library,
the same concept has the same name every time.

| concept | name |
| --- | --- |
| the current value | `value` |
| the starting value, uncontrolled | `defaultValue` |
| notification of change | `onValueChange` |
| open state | `open` / `defaultOpen` / `onOpenChange` |
| visual variant | `variant` |
| size | `size` |
| turned off | `disabled` |
| async in progress | `loading` or `pending`, pick one for the library |
| extra classes | `className` |
| the rendered element | `asChild` |

`onValueChange` rather than `onChange` when the argument is the value rather
than an event. this distinction is worth keeping: `onChange` implies a react
synthetic event and people will destructure `event.target.value` from it.

### booleans are positive and default to false

```tsx
{/* no */}  <Input disableAutocomplete hideLabel notEditable />
{/* yes */} <Input autoComplete={false} showLabel={false} editable={false} />
```

a negative boolean produces double negatives at the call site
(`disableAutocomplete={false}`) and nobody reads those correctly.

defaulting to `false` means the default behavior is whatever you get with no
props, which is what people expect.

`disabled` and `readOnly` are exceptions because they are platform names.
match the platform over the rule.

### one prop for a set of variants, not a boolean each

```tsx
{/* no: what does primary + destructive mean? */}
<Button primary destructive ghost />

{/* yes */}
<Button variant="destructive" />
```

boolean variants are mutually exclusive states expressed as independent flags,
so the type system allows combinations that have no meaning and the
implementation has to pick a precedence nobody can guess.

## the customization line

the balance to hit: opinionated enough to be worth using, open enough to
survive contact with a real design.

three layers, and a good component offers all three.

**layer one, tokens.** the component reads css custom properties for its
colors, radii and timing. a consumer retheming their whole app gets the
component for free without touching it.

**layer two, className.** merged last, so it wins.

```tsx
className={cn(
  "relative inline-flex items-center justify-center rounded-lg border",
  "transition-transform duration-150 ease-[var(--ease-out-quart)]",
  className
)}
```

merging last is the entire point. a consumer passing `rounded-none` must get
`rounded-none`, and with a naive string concatenation they get whichever the
css order happens to favor. use a merge utility that resolves conflicts by
class group.

expose the internal parts too, so a consumer can reach them:

```tsx
<span data-slot="compare-slider-knob" />
```

```css
[data-slot="compare-slider-knob"] { /* consumer styles the knob */ }
```

`data-slot` attributes cost nothing and turn a closed component into one that
can be adjusted without a fork.

**layer three, escape hatches.** props that turn behavior off rather than
adjusting it. `duration`, `paused`, `disabled`. someone is going to render
forty of these on one screen and they need the off switch.

## asChild

the pattern for "render as a different element without losing the behavior".

```tsx
<Button asChild>
  <Link href="/settings">Settings</Link>
</Button>
```

the button's styles, handlers and aria go onto the `Link`, and no extra dom
node is created. the alternative, a nested `<button><a></a></button>`, is
invalid html and produces a broken focus and click target.

```tsx
import { Slot } from "@radix-ui/react-slot"

export function Button({ asChild, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonClasses, className)} {...props} />
}
```

**use it when** the component is a style and behavior wrapper and the element
genuinely varies: buttons that are sometimes links, triggers that wrap
arbitrary content.

**do not use it when** the component owns internal structure. `asChild` on
something that renders three children has nowhere sensible to put them.

the caveat: `asChild` requires exactly one child element, and the error when
that is violated is not always clear. document it.

## refs and rest props

a reusable component forwards its ref and spreads what it does not consume.

```tsx
export function HoldButton({
  duration = 1200,
  onHold,
  className,
  ref: forwardedRef,
  ...props
}: HoldButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null)

  // the button needs its own ref to write the fill to, so a caller ref is
  // pointed at the same node rather than replacing it.
  React.useImperativeHandle(forwardedRef, () => ref.current as HTMLButtonElement)

  return <button ref={ref} className={cn(base, className)} {...props} />
}
```

that comment names the real problem. a component that needs its own ref cannot
simply pass the forwarded one through, and the wrong fix, choosing one over
the other, breaks either the internal behavior or the consumer's.
`useImperativeHandle` points both at the same node.

**spread rest props last but className first.** rest props go last so a
consumer can override an attribute. `className` is handled separately by the
merge, or the spread would clobber the merged result.

**extend the underlying element's prop type**, so every native attribute is
available and typed:

```tsx
export interface HoldButtonProps extends React.ComponentProps<"button"> {
  duration?: number
  onHold?: () => void
}
```

use `Omit` where you are changing the meaning of a native prop:

```tsx
export interface CompareSliderProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  onPositionChange?: (position: number) => void
}
```

## controlled and uncontrolled

support both. the pattern is small and it doubles the number of situations the
component fits.

```tsx
const [own, setOwn] = React.useState(defaultPosition)

const isControlled = position !== undefined
const value = clamp(isControlled ? position : own)

const commit = (next: number) => {
  const clamped = clamp(next)
  if (!isControlled) setOwn(clamped)
  onPositionChange?.(clamped)
}
```

three rules.

**controlled is detected by `undefined`, not by falsiness.** `value === 0` is a
valid controlled value.

**the callback fires in both modes.** a consumer who wants to observe without
controlling needs the callback, and forgetting this is the most common bug in
this pattern.

**never write to internal state while controlled.** the two would diverge and
the component would stop respecting its own prop.

do not warn or throw when a component switches modes. it happens during
loading states and the warning is noise.

## anti-patterns

**prop explosion.** fourteen props, most of them booleans, most of them
combinations of two underlying concerns. the fix is composition, or a
`variant` prop, or splitting the component in two.

**premature abstraction.** a generic component built for three call sites that
have not been written yet. it will be wrong in a way that is expensive to
undo. write the three, then extract what is actually shared.

**leaking implementation in the api.** `motionProps`, `innerContainerClassName`,
`swiperOptions`. these bind the consumer to a library you may want to replace,
and they document your internals as a public contract. expose the capability,
not the library.

**a render prop where children would do.** if the argument is not used, it is
a more complicated way of writing `children`.

**deep className props.** `className`, `contentClassName`,
`headerClassName`, `titleClassName`, `iconClassName`. this is composition
asking to be let out. use `data-slot` and let the consumer target the parts.

**required props with no sensible failure.** a component that renders nothing
or throws when a prop is missing should have a default, or the prop should be
part of a required union the type system enforces.

## documentation, in the type

for a component someone copies into their own project, the prop comments are
the documentation. write them as decisions, not as restatements.

```tsx
export interface CompareSliderProps {
  /** sits in flow and sets the size of the frame. shown before the divider. */
  before: React.ReactNode
  /** laid over the top and clipped to after the divider. */
  after: React.ReactNode
  /** divider position, 0 to 100. leave it out to let the slider own it. */
  position?: number
  /** percent moved per arrow key. shift moves five of these. */
  step?: number
}
```

`/** the position */` on a prop named `position` is not documentation. the
version above says what the element is for, what it does to layout, and what
leaving it out means.

## checklist

- [ ] composition where the arrangement varies, configuration where it does not
- [ ] names match the ecosystem, and each other, across the library
- [ ] booleans positive, defaulting to false
- [ ] variants in one `variant` prop, not a boolean each
- [ ] `className` merged last with a conflict-aware merge
- [ ] internal parts exposed as `data-slot`
- [ ] an escape hatch that turns the behavior off
- [ ] refs forwarded, and pointed at the same node as any internal ref
- [ ] props extend the underlying element type, `Omit` where redefined
- [ ] rest props spread last
- [ ] controlled and uncontrolled both supported, callback fires in both
- [ ] no library names in the public api
- [ ] prop comments say what the prop is for, not what it is called
