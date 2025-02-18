import libheif from 'https://cdn.jsdelivr.net/npm/libheif-js@1.17.1/libheif-wasm/libheif-bundle.mjs';
const { HeifDecoder } = libheif();

export async function decodeHeif(buffer) {
  const decoder = new HeifDecoder();

  const data = decoder.decode(buffer);
  const image = data[0];
  const width = image.get_width();
  const height = image.get_height();

  // let imageData = new Uint8Array(width * height * 4);
  let imageData = new ImageData(width, height);
  await new Promise((resolve, reject) => {
    image.display(imageData, (displayData) => {
      if (!displayData) {
        return reject(new Error('HEIF processing error'));
      }

      resolve();
    });
  });

  return imageData;
}