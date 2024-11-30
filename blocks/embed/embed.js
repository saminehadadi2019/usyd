

export default function decorate(block) {
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '600';
  iframe.src =new URL(block.textContent);
  block.textContent ='';
//  block.append(iframe);
}
