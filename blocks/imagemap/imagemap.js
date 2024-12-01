import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  // Get the block's text content and parse it
  const text = block.textContent.trim();
  block.textContent = ''; // Clear block content for rendering new elements

  // Regex patterns for extracting map configuration
  const srcRegex = /src=\s*([^;]+);/;
  const altRegex = /alt=\s*([^;]+);/;
  const shapeRegex = /shape=\s*([^;]+);/g;
  const coordRegex = /coord=\s*([^;]+);/g;
  const alertRegex = /alert=\s*([^;]+);/g;
  const urlRegex = /url=\s*([^;]+);/g;

  // Extract data from the text content
  const srcMatch = text.match(srcRegex);
  const altMatch = text.match(altRegex);
  const shapeMatches = [...text.matchAll(shapeRegex)].map((m) => m[1].trim());
  const coordMatches = [...text.matchAll(coordRegex)].map((m) => m[1].trim());
  const alertMatches = [...text.matchAll(alertRegex)].map((m) => m[1].trim());
  const urlMatches = [...text.matchAll(urlRegex)].map((m) => m[1].trim());

  const src = srcMatch ? srcMatch[1].trim() : '';
  const alt = altMatch ? altMatch[1].trim() : '';

  // Debug: Log extracted values
  console.log("Source:", src);
  console.log("Alt text:", alt);
  console.log("Shapes:", shapeMatches);
  console.log("Coordinates:", coordMatches);
  console.log("Alerts:", alertMatches);
  console.log("URLs:", urlMatches);

  // Create map and image elements
  const map = document.createElement('map');
  map.name = 'myMap';

  const image = document.createElement('img');
  image.src = src;
  image.alt = alt;
  image.useMap = '#myMap';

  // Dynamically create <area> elements based on parsed data
  for (let i = 0; i < shapeMatches.length; i++) {
    const area = document.createElement('area');
    area.shape = shapeMatches[i];
    area.coords = coordMatches[i];
    area.href = urlMatches[i] || 'javascript:void(0)'; // Prevent default navigation if no URL
    area.target = '_blank'; // Open in new tab if a URL is provided
    area.addEventListener('click', (event) => {
      event.preventDefault();
      if (alertMatches[i]) {
        alert(alertMatches[i]);
      }
    });

    map.appendChild(area);
  }

  // Append the image and map to the block
  block.appendChild(image);
  block.appendChild(map);
}
