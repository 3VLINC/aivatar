import { getSignedKey } from "~/utils/getSignedKey";

export async function action() {
  return getSignedKey();
}
