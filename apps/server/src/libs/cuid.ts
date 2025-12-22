import { init } from "@paralleldrive/cuid2";

export const generateId = init({
  length: 24,
});
