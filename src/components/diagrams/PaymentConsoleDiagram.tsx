import { Boundary, Caption, Link, Tier } from "./parts";

/**
 * Architecture of the XPI payment management console.
 *
 * Stands in for a screenshot: the platform is a client's internal system, so
 * nothing of its interface can be shown. A diagram carries the part that is
 * mine to describe — the shape of the system and where my work sat in it —
 * and carries no client data at all.
 */
export function PaymentConsoleDiagram() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="block h-full w-full"
      role="img"
      aria-label="System diagram: more than 5,000 professional clients use the management console, which reaches the core payment platform across a secure transaction API boundary."
    >
      <Caption y={42}>5,000+ PROFESSIONAL CLIENTS</Caption>

      <Link from={50} to={74} />

      <Tier
        y={74}
        title="MANAGEMENT CONSOLE"
        detail="JAVASCRIPT · JQUERY · DOM"
        accent
      />

      <Link from={142} to={168} />

      {/* The boundary I integrated and tested across — dashed, because it is a
          trust boundary rather than a component. */}
      <Boundary y={172} label="SECURE TRANSACTION API" />

      <Link from={172} to={198} />

      <Tier y={198} title="CORE PAYMENT PLATFORM" detail="BACKEND TEAM" />
    </svg>
  );
}
