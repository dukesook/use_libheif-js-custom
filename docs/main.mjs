import { decodeHeif } from './UseLibheif.mjs';

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
    const { imageData, width, height } = await decodeHeif(buffer);
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





async function displayImage (imageData, width, height) {
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  context.putImageData(imageData, 0, 0);
};
