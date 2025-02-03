import type { LoaderFunctionArgs } from "react-router";
import { getNeynarClient } from "~/clients/getNeynarSdk";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const signerUuid = url.searchParams.get("signer_uuid");

  if (!signerUuid) {
    return { error: "signer_uuid is required" };
  }

  const neynarClient = await getNeynarClient();
  return neynarClient.lookupSigner({ signerUuid });
}
