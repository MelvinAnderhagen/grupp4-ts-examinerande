import { apiPost } from "./client";
import type { Rum } from "../types/rum";
import type { NewRum } from "../types/newRum";

export async function postRum(rum: NewRum): Promise<Rum> {
  return apiPost<Rum, NewRum>("/rum", rum);
}
