import { z } from "zod";
import { createGameId, createThemeId, type GameId, type ThemeId } from "./ids";
import { failure, success, type Result } from "./result";

export const gameCapabilitySchema = z.enum(["audio", "microphone", "offline-package"]);
export type GameCapability = z.infer<typeof gameCapabilitySchema>;

export const gameManifestSchema = z
  .object({
    ageRange: z
      .object({
        max: z.number().int().min(1).max(18),
        min: z.number().int().min(1).max(18),
      })
      .refine(({ max, min }) => min <= max, "Minimumleeftijd mag niet boven maximum liggen."),
    capabilities: z.array(gameCapabilitySchema).default([]),
    cardImageUrl: z.string().trim().min(1).optional(),
    contentVersion: z.string().trim().min(1),
    contractVersion: z.literal(1),
    description: z.string().trim().min(1),
    icon: z.string().trim().min(1),
    id: z.string().trim().min(1).transform(createGameId),
    offlinePackages: z.array(
      z.object({
        contentVersion: z.string().trim().min(1),
        id: z.string().trim().min(1),
        manifestUrl: z.string().trim().min(1),
        version: z.number().int().positive(),
      }),
    ),
    releaseStatus: z.enum(["available", "beta", "coming-soon"]),
    requiredCapabilities: z.array(gameCapabilitySchema).default([]),
    supportedOrientations: z.array(z.enum(["portrait", "landscape"])).min(1),
    themeId: z.string().trim().min(1).transform(createThemeId),
    title: z.string().trim().min(1),
  })
  .superRefine(({ capabilities, requiredCapabilities }, context) => {
    requiredCapabilities.forEach((capability) => {
      if (!capabilities.includes(capability)) {
        context.addIssue({
          code: "custom",
          message: `Vereiste capability '${capability}' ontbreekt in capabilities.`,
          path: ["requiredCapabilities"],
        });
      }
    });
  });

export type GameManifest = Omit<z.output<typeof gameManifestSchema>, "id" | "themeId"> & {
  id: GameId;
  themeId: ThemeId;
};

export interface ManifestValidationFailure {
  code: "invalid-game-manifest";
  issues: Array<{ message: string; path: string }>;
}

export const parseGameManifest = (
  value: unknown,
): Result<GameManifest, ManifestValidationFailure> => {
  const parsed = gameManifestSchema.safeParse(value);
  if (!parsed.success) {
    return failure({
      code: "invalid-game-manifest",
      issues: parsed.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path.join("."),
      })),
    });
  }
  return success(parsed.data);
};

export const defineGameManifest = (value: unknown): GameManifest => {
  const parsed = parseGameManifest(value);
  if (!parsed.ok) {
    throw new TypeError(
      `Ongeldig gamemanifest: ${parsed.error.issues
        .map((issue) => `${issue.path}: ${issue.message}`)
        .join(", ")}`,
    );
  }
  return parsed.value;
};
