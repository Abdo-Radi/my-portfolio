import { Boundary, Caption, Link, Tier } from "./parts";

/**
 * The factoring data flows at Bank of Africa.
 *
 * Another client system that cannot be shown, drawn on the same 400×300 grid
 * as the payment console so the two plates read as a set. The vermilion tier
 * is the automation I wrote; the platform above and the interfaces below are
 * the bank's, and nothing identifying either appears here.
 */
export function FactoringFlowDiagram() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="block h-full w-full"
      role="img"
      aria-label="System diagram: the factoring platform feeds automated Python and Batch flows, which are diagnosed through PL/SQL against SLAs and write out to the data-transfer interfaces between systems."
    >
      <Caption y={42}>FACTORING PLATFORM · BANKING CLIENT</Caption>

      <Link from={50} to={74} />

      <Tier
        y={74}
        title="AUTOMATED FLOWS"
        detail="PYTHON · BATCH SCRIPTING"
        accent
      />

      <Link from={142} to={168} />

      {/* Incidents are diagnosed across this line, against the SLA clock. */}
      <Boundary y={172} label="PL/SQL DIAGNOSIS · SLA-BOUND" />

      <Link from={172} to={198} />

      <Tier y={198} title="TRANSFER INTERFACES" detail="WINDOWS SERVER" />
    </svg>
  );
}
