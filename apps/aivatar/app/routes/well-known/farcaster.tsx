import type { Route } from './+types/farcaster';

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  url.protocol = 'https';
  return {
    accountAssociation: {
      header:
        'eyJmaWQiOjg3MDYsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwNGFjODVjY2E1MDRCMmFGRUFCMDllODVFZjk4MTZjOTJFQ0MzYkIyIn0',
      payload: 'eyJkb21haW4iOiJhaXZhdGFyLjN2bC5jYSJ9',
      signature:
        'MHg0MWI1Yzc4NzBmZTgyNzllMjA1NTBkZjExZmIwNDY4YjRmZGU1NGI4YjkyMDU4ZTc5NjlkYTMwMGI3YzNhZmFmMjE1YTA2ZWUxOTBjYWM3MmRhZTc0YjRjNmFkMjg3NTgwODAyNWY2NTkyZGE2YmVkNzA1MjYwZmMzZGEwM2M0MDFi',
    },
    frame: {
      version: '1',
      name: 'AIVATAR',
      iconUrl: `${url.protocol}//${url.hostname}/icon.png`,
      homeUrl: `${url.protocol}//${url.hostname}`,
      imageUrl: `${url.protocol}//${url.hostname}/image.png`,
      buttonTitle: 'YOUR AGENTIC AVATAR',
      splashImageUrl: `${url.protocol}//${url.hostname}/splash.png`,
      splashBackgroundColor: '#f7d932',
      webhookUrl: `${url.protocol}//${url.hostname}/api/webhook`,
    },
  };
}
