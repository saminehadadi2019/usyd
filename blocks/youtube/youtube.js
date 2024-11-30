
import loadVideo from '../../scripts/delayed.js';

export default async function decorate(block) {
  const videoURL = new URL(block.textContent);
  block.addEventListener('click', () => loadVideo(videoURL, block));
}