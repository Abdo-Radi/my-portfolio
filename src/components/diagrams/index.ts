import type { ComponentType } from "react";

import type { DiagramKey } from "@/data/projects";
import { FactoringFlowDiagram } from "./FactoringFlowDiagram";
import { PaymentConsoleDiagram } from "./PaymentConsoleDiagram";

/**
 * Diagram plates, keyed by the `diagram` field on a project.
 *
 * Typed as a total `Record<DiagramKey, …>`, so adding a key in `projects.ts`
 * without drawing the diagram is a type error rather than a blank plate. The
 * lookup in `ProjectPlate` is therefore unconditional.
 */
export const DIAGRAMS: Record<DiagramKey, ComponentType> = {
  "payment-console": PaymentConsoleDiagram,
  "factoring-flow": FactoringFlowDiagram,
};
