import decodeHeif from './UseLibheif.mjs';

const loadButton = document.querySelector('#loadButton');
const canvas = document.querySelector('canvas');


loadButton.addEventListener('change', function (event) {
  const file = event.target.files[0];
  processFile(file);
});


async function processFile(file) {
  try {
    const buffer = await readFile(file);
    const imageData = await decodeHeif(buffer);
    console.log('imageData:', imageData);
    await displayImage(imageData);
  } catch (err) {
    console.error('failed to convert image:', err);
  }
}


async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(new Uint8Array(e.target.result));
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}


async function displayImage(imageData) {
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const context = canvas.getContext('2d');

  context.putImageData(imageData, 0, 0);
};
