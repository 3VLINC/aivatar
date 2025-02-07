import { useProfile } from '@farcaster/auth-kit';
import type { AppUser } from '~/interface';
import { useAppContext } from '~/providers/AppContext';
import { useRestoredUser } from '~/providers/RestoredUser';

export const useUserResolver = () => {
  const appContext = useAppContext();
  const authKitProfile = useProfile();
  const { user: restoredUser } = useRestoredUser();

  let user: AppUser | null = null;

  if (restoredUser) {
    user = restoredUser;
  } else if (authKitProfile.profile) {
    const { profile } = authKitProfile;
    if (!profile.fid) {
      user = null;
    } else {
      user = {
        fid: profile.fid.toString(),
        pfpUrl: profile.pfpUrl,
        username: profile.username,
        displayName: profile.displayName,
      };
    }
  } else if (appContext.type === 'frame') {
    const { context } = appContext;

    user = {
      fid: context.user.fid.toString(),
      displayName: context.user.displayName,
      pfpUrl: context.user.pfpUrl,
      username: context.user.username,
    };
  }

  return user;
};
