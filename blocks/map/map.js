export default function decorate(block) {
  // Create a map element and set its name
  const map = document.createElement('map');
  map.name = 'myMap';
  
  // Create an image element and link it to the map
  const image = document.createElement('img');
  image.src = 'https://i.ibb.co/S393wpr/map.png';
  image.alt = 'Image Description';
  image.useMap = '#myMap'; // Links the image to the map
  
  // Create area1
  const area1 = document.createElement('area');
  area1.shape = 'circle';
  area1.coords = '200,200,90';
  area1.href = 'javascript:void(0)'; // Prevents default behavior of <a> tag
  area1.addEventListener('click', (event) => {
    event.preventDefault(); // Prevents navigation
    alert('Clicked on Area 1');
  });

  // Create area2
  const area2 = document.createElement('area');
  area2.shape = 'circle';
  area2.coords = '780,780,140';
  area2.href = 'javascript:void(0)'; // Prevents default behavior of <a> tag
  area2.addEventListener('click', (event) => {
    event.preventDefault(); // Prevents navigation
    alert('Clicked on Area 2');
  });

  // Append the areas to the map
  map.appendChild(area1);
  map.appendChild(area2);
  
  // Append the image and map to the block
  block.appendChild(image);
  block.appendChild(map);
}
