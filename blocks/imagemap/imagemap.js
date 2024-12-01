import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const text = block.textContent.trim();
  block.textContent = '';

  try {
    const src = text.match(/src=([^;]+);/)?.[1]?.trim() || '';
    const alt = text.match(/alt=([^;]+);/)?.[1]?.trim() || '';

    const areas = [...text.matchAll(/shape=([^;]+);coord=([^;]+);alert=([^;]+);url=([^;]+);/g)];

    const map = document.createElement('map');
    map.name = 'myMap';
    const image = document.createElement('img');
    image.src = src;
    image.alt = alt;
    image.useMap = '#myMap';

    for (const [, shape, coord, alertMessage, url] of areas) {
      const area = document.createElement('area');
      area.shape = shape.trim();
      area.coords = coord.trim();
      area.href = url.trim();
      area.target = '_blank';

      // Adding click listeners
      area.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default behavior (like navigating to `url`)
        alert(alertMessage.trim());
      });

      map.appendChild(area);
    }

    // Adding an overall click listener for the image
    image.addEventListener('click', () => {
      console.log("Image clicked");
    });

    block.appendChild(image);
    block.appendChild(map);
  } catch (error) {
    console.error('Error:', error);
  }
}
