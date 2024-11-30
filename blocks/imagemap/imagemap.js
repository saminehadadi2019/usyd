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
      area.addEventListener('click', () => alert(alertMessage.trim()));
      map.appendChild(area);
    }

    block.appendChild(image);
    block.appendChild(map);
  } catch (error) {
    console.error('Error:', error);
  }
}
