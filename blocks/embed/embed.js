export default function decorate(block) {
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '600';

  try {
    const url = new URL(block.textContent.trim());
    iframe.src = url;
    block.textContent = '';
    block.append(iframe);
  } catch (error) {
    console.error('Invalid URL:', block.textContent, error);
    block.textContent = 'Error: Unable to load iframe content.';
  }
}
