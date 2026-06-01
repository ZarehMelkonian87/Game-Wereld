import type { ReactElement } from "react";

export type DevtoolsComponent<Props = Record<string, never>> = ((
  props: Props,
) => ReactElement | null) & {
  displayName?: string;
};
