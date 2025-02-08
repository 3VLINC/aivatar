export function loader() {
  return {
    accountAssociation: {
      header:
        'eyJmaWQiOjg3MDYsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwNGFjODVjY2E1MDRCMmFGRUFCMDllODVFZjk4MTZjOTJFQ0MzYkIyIn0',
      payload: 'eyJkb21haW4iOiJkZXYuM3ZsLmNhIn0',
      signature:
        'MHgxNjkzZDBlMmUwYmNmMWUzNGVjMWRmM2U3MmY0NDcyODc4ZmRlMjM4MzM5NzE0OTFiMmNhNzZhYTFjOGU4ZGZlMDJiNjQyNDQ5MzRkMWQyOGQ0ZjRkMGM0Y2UwZjJiZTAwMWMxYzAwOWU4OTRiNTFmNmY4MWQyODU2NDdjNjAzODFj',
    },
    frame: {
      version: '1',
      name: 'AIVATAR',
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
