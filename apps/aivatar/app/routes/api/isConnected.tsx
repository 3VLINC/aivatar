import { db, users } from '@aivatar/drizzle';
import { eq } from 'drizzle-orm';
import type { Route } from './+types/isConnected';

export async function action({ request }: Route.ActionArgs) {
  const json = await request.json();

  if (!json.fid) {
    throw new Error('No fid provided');
  }
  if (json.fid) {
    const { fid } = json;

    return db
      .select()
      .from(users)
      .where(eq(users.fid, BigInt(fid)))
      .limit(1)
      .then((result) => (result.length >= 1 ? true : false));
  } else {
    return false;
  }
}
