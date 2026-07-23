import type { StickerObjectProps } from "../../../../game-platform";
import { StickerObject } from "../../../../game-platform";

export type ObjectStickerButtonProps = StickerObjectProps;

export const ObjectStickerButton = (props: ObjectStickerButtonProps) => (
  <StickerObject {...props} />
);

ObjectStickerButton.displayName = "ObjectStickerButton";
