import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  try {
    // Extract text content from the block
    const text = block.textContent.trim();
    block.textContent = ''; // Clear block for rendering new elements

    // Define regex patterns to parse the input
    const srcRegex = /src=\s*([^;]+);/;
    const altRegex = /alt=\s*([^;]+);/;
    const shapeRegex = /shape=\s*([^;]+);/g;
    const coordRegex = /coord=\s*([^;]+);/g;
    const alertRegex = /alert=\s*([^;]+);/g;
    const urlRegex = /url=\s*([^;]+);/g;

    // Parse the input text
    const srcMatch = text.match(srcRegex);
    const altMatch = text.match(altRegex);
    const shapeMatches = [...text.matchAll(shapeRegex)].map(match => match[1].trim());
    const coordMatches = [...text.matchAll(coordRegex)].map(match => match[1].trim());
    const alertMatches = [...text.matchAll(alertRegex)].map(match => match[1].trim());
    const urlMatches = [...text.matchAll(urlRegex)].map(match => match[1].trim());

    // Extract values
    const src = srcMatch ? srcMatch[1].trim() : '';
    const alt = altMatch ? altMatch[1].trim() : '';

    // Debug: Log the extracted values
    console.log("Source:", src);
    console.log("Alt Text:", alt);
    console.log("Shapes:", shapeMatches);
    console.log("Coordinates:", coordMatches);
    console.log("Alert Messages:", alertMatches);
    console.log("URLs:", urlMatches);

    // Ensure the source (src) is provided
    if (!src) {
      console.error('Image source (src) is missing.');
      return;
    }

    // Create the image element and link it to the map
    const image = document.createElement('img');
    image.src = src;
    image.alt = alt;
    image.useMap = '#myMap';

    // Create the map element
    const map = document.createElement('map');
    map.name = 'myMap';

    // Dynamically create and append <area> elements
    for (let i = 0; i < shapeMatches.length; i++) {
      const area = document.createElement('area');
      area.shape = shapeMatches[i];
      area.coords = coordMatches[i] || ''; // Ensure coords are provided
      area.href = urlMatches[i] || 'javascript:void(0)'; // Prevent navigation if no URL
      area.target = '_blank'; // Open links in a new tab
      area.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default behavior
        if (alertMatches[i]) {
          alert(alertMatches[i]);
        }
      });

      map.appendChild(area);
    }

    // Append elements to the block
    block.appendChild(image);
    block.appendChild(map);

    console.log('Interactive map created successfully.');
  } catch (error) {
    console.error('An error occurred while creating the interactive map:', error);
  }
}
