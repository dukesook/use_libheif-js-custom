import libheif_custom from './libs/libheif.js';
import libheif_catdad from 'https://cdn.jsdelivr.net/npm/libheif-js@1.17.1/libheif-wasm/libheif-bundle.mjs';

export async function decodeHeifCustom(buffer) {
  console.log(libheif);

}
const heif = libheif_custom(); // Initialize the WebAssembly module
console.log("libheif initialized!", heif);



export async function decodeHeif(buffer) {
  const { HeifDecoder } = libheif_catdad();
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

