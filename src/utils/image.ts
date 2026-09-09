export function appendImageDimensions(url: string): string {
  if (!url) return url;
  
  // Replace the extension (and any trailing query params/hashes) with _900x500.extension
  // E.g. image.jpg -> image_900x500.jpg
  // image.png?v=1 -> image_900x500.png?v=1
  return url.replace(/(\.[a-zA-Z0-9]+)([\?#].*)?$/, '_900x500$1$2');
}
