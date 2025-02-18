import libheif from 'https://cdn.jsdelivr.net/npm/libheif-js@1.17.1/libheif-wasm/libheif-bundle.mjs';
const { HeifDecoder } = libheif();

const loadButton = document.querySelector('#loadButton');
const canvas = document.querySelector('canvas');

// Event Listener
loadButton.addEventListener('change', function (event) {
  const file = event.target.files[0];
  processFile(file);
});

// Process File
async function processFile(file) {
  try {
    const buffer = await readFile(file);
    const { imageData, width, height } = await getImageData(buffer);
    console.log('imageData:', imageData);
    await displayImage(imageData, width, height);
  } catch (err) {
    console.error('failed to convert image:', err);
  }
}

// Read File
async function readFile (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(new Uint8Array(e.target.result));
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}


async function getImageData(buffer) {
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

  return { imageData, width, height };
}


async function displayImage (imageData, width, height) {
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  context.putImageData(imageData, 0, 0);
};
