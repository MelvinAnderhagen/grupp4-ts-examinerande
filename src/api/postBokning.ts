import { apiPost } from "./client";
import type { Bokning } from "../types/bokning";
import type { NewBokning } from "../types/newBokning";

export async function postBokning(bokning: NewBokning): Promise<Bokning> {
  return apiPost<Bokning, NewBokning>("/bokningar", bokning);
}
