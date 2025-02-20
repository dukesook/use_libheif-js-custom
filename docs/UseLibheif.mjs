import initLibheif from './libs/libheif.js'; // Built from source
import libheif_catdad from 'https://cdn.jsdelivr.net/npm/libheif-js@1.17.1/libheif-wasm/libheif-bundle.mjs';

// $ USE_ES6=1 USE_WASM=0 ../build-emscripten.sh ..
let libheif = null;

export default async function decodeHeif(buffer) {
  // return decodeHeifCatDad(buffer);
  return decodeHeifCustom(buffer);
}



async function decodeHeifCustom(buffer) {
  const ctx = libheif.heif_context_alloc();
  let error = libheif.heif_context_read_from_memory(ctx, buffer);
  console.log('ctx:', ctx);

  const filetype = libheif.heif_js_check_filetype(buffer);
  console.log('filetype:', filetype);

  const num_images = libheif.heif_context_get_number_of_top_level_images(ctx);
  console.log('num_images:', num_images);


  const ids = libheif.heif_js_context_get_list_of_top_level_image_IDs(ctx);
  console.log('ids:', ids);

  // NEW FUNCTION
  const num_items = libheif.heif_context_get_number_of_items(ctx);
  console.log('num_items:', num_items);
  
  // NEW FUNCTION
  const item_ids = libheif.heif_js_context_get_list_of_item_IDs(ctx);
  console.log('num_items:', item_ids);


  for (let item_id of item_ids) {
    const type = libheif.heif_item_get_item_type(ctx, item_id);
    console.log('type:', type);

    const type_string = libheif.heif_js_item_get_item_type_string(ctx, item_id);
    console.log('type_string:', type_string);

    const content_type = libheif.heif_js_item_get_mime_item_content_type(ctx, item_id);
    console.log('content_type:', content_type);

    const hidden = libheif.heif_item_is_item_hidden(ctx, item_id);
    console.log('hidden:', hidden);

    console.log(' ');
  }

  // Primary Image
  const primary_handle = libheif.heif_js_context_get_primary_image_handle(ctx);
  const colorspace = libheif.heif_colorspace.heif_colorspace_RGB;
  const chroma = libheif.heif_chroma.heif_chroma_interleaved_RGBA;
  const heifImage = libheif.heif_js_decode_image2(primary_handle, colorspace, chroma);
  console.log('heifImage:', heifImage);

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const handle = libheif.heif_js_context_get_image_handle(ctx, id);

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

