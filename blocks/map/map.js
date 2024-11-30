import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  try {
  const map = document.createElement('map');
  map.name = 'myMap'
  const image = document.createElement('img');
  image.src = 'https://i.ibb.co/S393wpr/map.png';
  image.alt = 'Image Description';
  image.useMap = '#myMap';

  const area1 = document.createElement('area');
  area1.shape = 'circle';
  area1.coords = '200,200,90';
 
    area1.addEventListener('click', () => {
      alert('Clicked on Area 1');
    });
    area1.style.borderBlockColor = 'red';
    area1.href = "#"

    const area2 = document.createElement('area');
    area2.shape = 'circle';
    area2.coords = '780,780,140';
    area2.addEventListener('click', () => {
      alert('Clicked on Area 2');
    });
    area2.style.backgroundColor = 'blue';
    area2.href = "#"

    // image.addEventListener('click', () => {
    //   console.log("I'm he")
    // });
   // map.append(area1);
    //map.append(area2);
  } catch {

  }

  // Append the image and map to the document
  // block.appendChild(image);
  //block.appendChild(map);

}

//block.append(image);
//block.append(map);
//block.append(map);



// https://i.ibb.co/zrHVB4x/Screenshot-2023-05-22-at-11-49-29-PM.png
// https://i.ibb.co/dPDsnL9/Design-for-all.png