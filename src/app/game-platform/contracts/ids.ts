import { failure, success, type Result } from "./result";

declare const idBrand: unique symbol;

type BrandedId<Name extends string> = string & {
  readonly [idBrand]: Name;
};

export type EventId = BrandedId<"EventId">;
export type GameId = BrandedId<"GameId">;
export type ProfileId = BrandedId<"ProfileId">;
export type SessionId = BrandedId<"SessionId">;
export type TaskId = BrandedId<"TaskId">;
export type ThemeId = BrandedId<"ThemeId">;

export interface InvalidId {
  code: "invalid-id";
  idType: "event" | "game" | "profile" | "session" | "task" | "theme";
  message: string;
  value: unknown;
}

const parseId = <Id extends string>(
  value: unknown,
  idType: InvalidId["idType"],
): Result<Id, InvalidId> => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return failure({
      code: "invalid-id",
      idType,
      message: `${idType}Id moet een niet-lege string zijn.`,
      value,
    });
  }

  return success(value.trim() as Id);
};

const requireId = <Id extends string>(result: Result<Id, InvalidId>): Id => {
  if (!result.ok) {
    throw new TypeError(result.error.message);
  }
  return result.value;
};

export const parseEventId = (value: unknown) => parseId<EventId>(value, "event");
export const parseGameId = (value: unknown) => parseId<GameId>(value, "game");
export const parseProfileId = (value: unknown) => parseId<ProfileId>(value, "profile");
export const parseSessionId = (value: unknown) => parseId<SessionId>(value, "session");
export const parseTaskId = (value: unknown) => parseId<TaskId>(value, "task");
export const parseThemeId = (value: unknown) => parseId<ThemeId>(value, "theme");

export const createEventId = (value: string) => requireId(parseEventId(value));
export const createGameId = (value: string) => requireId(parseGameId(value));
export const createProfileId = (value: string) => requireId(parseProfileId(value));
export const createSessionId = (value: string) => requireId(parseSessionId(value));
export const createTaskId = (value: string) => requireId(parseTaskId(value));
export const createThemeId = (value: string) => requireId(parseThemeId(value));
