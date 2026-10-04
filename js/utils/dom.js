export function el(tag, options = {}) {
  const { className, text, attrs = {}, on = {}, children = [] } = options;
  const node = document.createElement(tag);

  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;

  for (const [name, value] of Object.entries(attrs)) {
    node.setAttribute(name, value);
  }
  for (const [type, handler] of Object.entries(on)) {
    node.addEventListener(type, handler);
  }

  node.append(...children);
  return node;
}
