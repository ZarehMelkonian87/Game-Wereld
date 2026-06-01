import type { ObjectTrayProps } from "../../../../game-platform";
import { ObjectTray } from "../../../../game-platform";

export type ObjectTrayContainerProps = ObjectTrayProps;

export const ObjectTrayContainer = (props: ObjectTrayContainerProps) => <ObjectTray {...props} />;

ObjectTrayContainer.displayName = "ObjectTrayContainer";

