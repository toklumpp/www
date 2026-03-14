const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

function gatherCssFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...gatherCssFiles(fullPath));
    } else if (entry.isFile() && fullPath.endsWith('.css')) {
      files.push(fullPath);
    }
  }

  return files;
}

describe('CSS file parsing', () => {
  const cssDir = path.resolve(__dirname, '../assets/css');
  const cssFiles = gatherCssFiles(cssDir);

  test('All CSS files can be parsed by PostCSS without syntax errors', () => {
    expect(cssFiles.length).toBeGreaterThan(0);

    for (const cssPath of cssFiles) {
      const css = fs.readFileSync(cssPath, 'utf8');
      expect(() => postcss.parse(css)).not.toThrow();
    }
  });
});

function findRule(root, selector) {
  return root.nodes.find((node) => node.type === 'rule' && node.selector === selector);
}

describe('CSS rules required by index.html layout', () => {
  let root;

  beforeAll(() => {
    const cssPath = path.resolve(__dirname, '../assets/css/style.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    root = postcss.parse(css);
  });

  test('.sidebar should hide overflow and animate height', () => {
    const rule = findRule(root, '.sidebar');
    expect(rule).toBeDefined();

    const overflow = rule.nodes.find((d) => d.prop === 'overflow');
    expect(overflow).toBeDefined();
    expect(overflow.value).toBe('hidden');

    const transition = rule.nodes.find((d) => d.prop === 'transition');
    expect(transition).toBeDefined();
    expect(transition.value).toBe('var(--transition-2)');
  });

  test('.sidebar.active should allow expanded content', () => {
    const rule = findRule(root, '.sidebar.active');
    expect(rule).toBeDefined();

    const maxHeight = rule.nodes.find((d) => d.prop === 'max-height');
    expect(maxHeight).toBeDefined();
    expect(maxHeight.value).toBe('405px');
  });

  test('.navbar a.active should be non-interactive and highlighted', () => {
    const rule = findRule(root, '.navbar a.active');
    expect(rule).toBeDefined();

    const pointer = rule.nodes.find((d) => d.prop === 'pointer-events');
    expect(pointer).toBeDefined();
    expect(pointer.value).toBe('none');

    const cursor = rule.nodes.find((d) => d.prop === 'cursor');
    expect(cursor).toBeDefined();
    expect(cursor.value).toBe('default');
  });

  test('.icon-box should center its contents with flexbox', () => {
    const rule = findRule(root, '.icon-box');
    expect(rule).toBeDefined();

    const display = rule.nodes.find((d) => d.prop === 'display');
    expect(display).toBeDefined();
    expect(display.value).toBe('flex');

    const justifyContent = rule.nodes.find((d) => d.prop === 'justify-content');
    expect(justifyContent).toBeDefined();
    expect(justifyContent.value).toBe('center');

    const alignItems = rule.nodes.find((d) => d.prop === 'align-items');
    expect(alignItems).toBeDefined();
    expect(alignItems.value).toBe('center');
  });
});
