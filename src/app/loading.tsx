/**
 * Route loading state. No skeleton cards, no spinner blob — a mono label in the
 * corner and a signal hairline that draws across the foot of the area.
 *
 * The rule is pure CSS so this stays a server component with zero JavaScript.
 * `forwards` matters: the global reduced-motion rule collapses the duration to
 * 0.01ms and clamps the iteration count to 1, so the fill mode is what leaves
 * the rule drawn instead of snapping back to zero width.
 */
export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="shell flex min-h-[72svh] flex-col justify-between pt-[clamp(7.5rem,17vh,11rem)] pb-[clamp(3rem,7vw,5.5rem)]"
    >
      <style>{`
.pw-loading-rule {
  width: 0;
  animation: pw-loading-rule 1.6s cubic-bezier(0.16, 1, 0.3, 1) infinite forwards;
}
@keyframes pw-loading-rule {
  0% { width: 0 }
  70% { width: 100% }
  100% { width: 100% }
}
      `}</style>

      <p className="t-meta">Loading</p>

      <div aria-hidden="true" className="h-px w-full bg-rule">
        <span className="pw-loading-rule block h-px bg-signal" />
      </div>
    </div>
  );
}
