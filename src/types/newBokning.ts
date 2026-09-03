import type { Bokning } from "./bokning";

export type NewBokning = Omit<Bokning, "id">;
