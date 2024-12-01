import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default function decorate(block) {
  const text = block.textContent;
 //const text = "src=https://i.ibb.co/S393wpr/map.png;alt=carpet map;shape=circle;coord=200,200,90;alert=area 1;url='https://www.persianrugs.com.au/tabriz/';shape=circle;coord=780,780,140;alert=area 2;url='https://www.persianrugs.com.au/tabriz/'";
  block.textContent = '';
  text.replace(/\s/g, '').trim;
  const srcRegex = /src=\s*([^;]+);/;
  const altRegex = /alt=\s*([^;]+);/;
  const shapeRegex = /shape=\s*([^;]+);/g; 
  const coordRegex = /coord=\s*([^;]+);/g; 
  const alertRegex = /alert=\s*([^;]+);/g; 
  const urlRegex = /url=\s*([^;]+);/g; 
  
  const srcMatch = text.match(srcRegex);
  const altMatch = text.match(altRegex);
  const shapeMatches = text.match(shapeRegex);
  const coordMatches = text.match(coordRegex);
  const alertMatches = text.match(alertRegex);
  const urlMatches = text.match(urlRegex);
  
  const src = srcMatch ? srcMatch[1].trim() : '';
  const alt = altMatch ? altMatch[1].trim() : '';
  const shapes = shapeMatches ? shapeMatches.map(match => match.trim().replace("shape=", "").replace(";", "")) : [];
  const coords = coordMatches ? coordMatches.map(match => match.trim().replace("coord=", "").replace(";", "")) : [];
  const messages = alertMatches ? alertMatches.map(match => match.trim().replace("alert=", "").replace(";", "")) : [];
  const urls = urlMatches ? urlMatches.map(match => match.trim().replace("url=", "").replace(";", "")) : [];
  

  console.log("src:", src);
  console.log("alt:", alt);
  console.log("shapes:", shapes);
  console.log("coords:", coords);
  console.log("messages:", messages);
  console.log("messages:", urls);

  const map = document.createElement('map');
  map.name = 'myMap'
  const image = document.createElement('img');
  image.src = src;
  image.alt = alt;
  image.useMap = '#myMap';

  // for (let i = 0; i < shapes.length; i++) {
  //   const area = document.createElement('area');
  //   area.shape = shapes[i];
  //   area.coords = coords[i];
  //   area.addEventListener('click', () => {
  //     if(messages[i])
  //       alert(messages[i]);
  //   });
  //   area.style.borderBlockColor = 'red';
  //   area.href = urls[i];
  //   area.target ="_blank";

  //   map.append(area);
  // }
 
  block.appendChild(image);
 // block.appendChild(map);

}

