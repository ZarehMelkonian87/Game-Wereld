import type { ComponentType } from "react";

export type DevtoolsComponent<Props = Record<string, never>> = ComponentType<Props> & {
  displayName?: string;
};
