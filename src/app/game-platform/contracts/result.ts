export type Result<Value, Failure> = { ok: true; value: Value } | { error: Failure; ok: false };

export const success = <Value>(value: Value): Result<Value, never> => ({
  ok: true,
  value,
});

export const failure = <Failure>(error: Failure): Result<never, Failure> => ({
  error,
  ok: false,
});

export const assertNever = (value: never): never => {
  throw new Error(`Onverwachte contractvariant: ${JSON.stringify(value)}`);
};
