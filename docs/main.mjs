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
    await displayFile(buffer);
  } catch (err) {
    console.error('failed to convert image:', err);
  }
}

// Read File
const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => resolve(new Uint8Array(e.target.result));
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });

// Display File
const displayFile = async (buffer) => {
  const decoder = new HeifDecoder();

  const data = decoder.decode(buffer);
  const image = data[0];
  const width = image.get_width();
  const height = image.get_height();

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  const imageData = context.createImageData(width, height);
  await new Promise((resolve, reject) => {
    image.display(imageData, (displayData) => {
      if (!displayData) {
        return reject(new Error('HEIF processing error'));
      }

      resolve();
    });
  });

  context.putImageData(imageData, 0, 0);
};
