import type { ActionFunctionArgs } from "react-router";
import { getNeynarClient } from "~/clients/getNeynarSdk";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.json();
  console.log(formData);
  const signerUuid = formData.signerUuid;
  const neynar = await getNeynarClient();
  //   const randomLatitude = (Math.random() * 180 - 90).toFixed(6);
  //   const randomLongitude = (Math.random() * 360 - 180).toFixed(6);

  const pfpUrl = `https://eepvers.xyz/erc721/EEPMKY/image/${
    Math.floor(Math.random() * 187) + 1
  }.png`;
  //   const pfpUrl = `https://archive.mpi.nl/mpi/islandora/object/lat%3A1839_626142d5_4502_4736_92a8_3c70b1de0de0/datastream/OBJ/view`;

  //   console.log("new pfp url", pfpUrl);
  await neynar
    .updateUser({
      signerUuid: signerUuid as string,
      pfpUrl,
    })
    .then((result) => {
      console.log("success", result.message);
    })
    .catch((err) => {
      console.error("error", err.message);
    });

  //   return { signedKey };
}
