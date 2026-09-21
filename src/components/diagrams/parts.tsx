/**
 * Shared marks for the diagram plates.
 *
 * Every plate is built from these, on one 400×300 viewBox with the same
 * rhythm, so an archive of diagrams reads as a set rather than as separate
 * drawings. Colours are tokens, so the plates invert with the theme.
 */
export const MONO = "var(--font-mono), ui-monospace, monospace";

/** Tier box: hairline rectangle, a name, and the detail under it. */
export function Tier({
  y,
  title,
  detail,
  accent = false,
}: {
  y: number;
  title: string;
  detail: string;
  /** Marks the layer I owned. One vermilion per plate. */
  accent?: boolean;
}) {
  return (
    <>
      <rect
        x={56}
        y={y}
        width={288}
        height={68}
        fill="none"
        stroke={accent ? "var(--signal)" : "var(--rule-strong)"}
        strokeWidth={accent ? 1.6 : 1}
      />
      <text
        x={200}
        y={y + 30}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={15}
        letterSpacing="0.08em"
        fill={accent ? "var(--ink)" : "var(--ink-2)"}
      >
        {title}
      </text>
      <text
        x={200}
        y={y + 50}
        textAnchor="middle"
        fontFamily={MONO}
        fontSize={9}
        letterSpacing="0.14em"
        fill="var(--ink-3)"
      >
        {detail}
      </text>
    </>
  );
}

/** Vertical hairline joining two tiers. */
export function Link({ from, to }: { from: number; to: number }) {
  return (
    <line
      x1={200}
      y1={from}
      x2={200}
      y2={to}
      stroke="var(--rule-strong)"
      strokeWidth={1}
    />
  );
}

/**
 * A dashed rule with its label — a boundary crossed, rather than a component.
 * The label is set from x=40 so it aligns with the rule and clears the
 * connector running down the centre at x=200.
 */
export function Boundary({ y, label }: { y: number; label: string }) {
  return (
    <>
      <text
        x={40}
        y={y - 8}
        fontFamily={MONO}
        fontSize={9}
        letterSpacing="0.14em"
        fill="var(--ink-2)"
      >
        {label}
      </text>
      <line
        x1={40}
        y1={y}
        x2={360}
        y2={y}
        stroke="var(--rule-strong)"
        strokeWidth={1}
        strokeDasharray="5 5"
      />
    </>
  );
}

/** The caption above the first tier — who or what the system serves. */
export function Caption({ y, children }: { y: number; children: string }) {
  return (
    <text
      x={200}
      y={y}
      textAnchor="middle"
      fontFamily={MONO}
      fontSize={10}
      letterSpacing="0.14em"
      fill="var(--ink-3)"
    >
      {children}
    </text>
  );
}
