import { ZodError } from "zod";

export const handleZodError = (err: unknown) => {
  if (err instanceof ZodError) {
    return err.issues.map(e => ({
      field: e.path.join("."),
      message: e.message,
    }));
  }
  return [{ field: "unknown", message: "Unexpected error" }];
};
