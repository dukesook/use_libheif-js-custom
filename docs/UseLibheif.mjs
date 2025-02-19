import initLibheif from './libs/libheif.js'; // Built from source
import libheif_catdad from 'https://cdn.jsdelivr.net/npm/libheif-js@1.17.1/libheif-wasm/libheif-bundle.mjs';

let libheif = null; // USE_WASM=0 

export default async function decodeHeif(buffer) {
  // return decodeHeifCatDad(buffer);
  return decodeHeifCustom(buffer);
}

function createImageData(rgbData, width, height) {
  if (rgbData.length !== width * height * 3) {
    throw new Error("RGB data length does not match width * height * 3");
  }

  const rgbaData = new Uint8ClampedArray(width * height * 4); // Allocate RGBA array

  let j = 0;
  for (let i = 0; i < rgbData.length; i += 3) {
    rgbaData[j++] = rgbData[i];     // R
    rgbaData[j++] = rgbData[i + 1]; // G
    rgbaData[j++] = rgbData[i + 2]; // B
    rgbaData[j++] = 255;            // A (fully opaque)
  }

  return new ImageData(rgbaData, width, height);
}


async function decodeHeifCustom(buffer) {
  const ctx = libheif.heif_context_alloc();
  let error = libheif.heif_context_read_from_memory(ctx, buffer);
  console.log('ctx:', ctx);

  const num_images = libheif.heif_context_get_number_of_top_level_images(ctx);
  console.log('num_images:', num_images);


  const ids = libheif.heif_js_context_get_list_of_top_level_image_IDs(ctx);
  console.log('ids:', ids);

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const handle = libheif.heif_js_context_get_image_handle(ctx, id);
    const colorspace = libheif.heif_colorspace.heif_colorspace_RGB;
    const chroma = libheif.heif_chroma.heif_chroma_interleaved_RGBA;
    const image = libheif.heif_js_decode_image2(handle, colorspace, chroma);
    if (!image || image.code) {
      console.log("Decoding image failed", handle, img);
    }
    console.log('image:', image);
    const channels = image.channels;
    for (let channel of channels) {
      console.log('channel:', channel);
      const pixels = new Uint8ClampedArray(channel.data);
      const height = channel.height;
      const width = channel.width;
      const stride = channel.stride;
      const imageData = new ImageData(pixels, width, height);
      return imageData;
    }
  }

}



initLibheif().then((instance) => {
  libheif = instance;
  console.log("libheif is ready!", libheif);
  const version = libheif.heif_get_version();
  console.log("libheif version:", version);
}).catch((error) => {
  console.error("Failed to load libheif", error);
});



async function decodeHeifCatDad(buffer) {
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

