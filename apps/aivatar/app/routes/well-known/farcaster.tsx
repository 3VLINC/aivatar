export function loader() {
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
      name: 'Example Frame',
      iconUrl: 'https://aivatar.3vl.ca/icon.png',
      homeUrl: 'https://aivatar.3vl.ca',
      imageUrl: 'https://aivatar.3vl.ca/image.png',
      buttonTitle: 'Check this out',
      splashImageUrl: 'https://aivatar.3vl.ca/splash.png',
      splashBackgroundColor: '#eeccff',
      webhookUrl: 'https://aivatar.3vl.ca/api/webhook',
    },
  };
}
