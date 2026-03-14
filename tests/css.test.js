const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

function findRule(root, selector) {
  return root.nodes.find(
    (node) => node.type === 'rule' && node.selector === selector
  );
}

describe('CSS structure for project icon buttons', () => {
  let root;

  beforeAll(() => {
    const cssPath = path.resolve(__dirname, '../assets/css/style.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    root = postcss.parse(css);
  });

  test('`.project-item-icon-box` should default to hidden (opacity 0)', () => {
    const rule = findRule(root, '.project-item-icon-box');
    expect(rule).toBeDefined();

    const opacity = rule.nodes.find((d) => d.prop === 'opacity');
    expect(opacity).toBeDefined();
    expect(opacity.value).toBe('0');
  });

  test('`.project-item figure:hover .project-item-icon-box` should become visible on hover', () => {
    const rule = findRule(root, '.project-item figure:hover .project-item-icon-box');
    expect(rule).toBeDefined();

    const opacity = rule.nodes.find((d) => d.prop === 'opacity');
    expect(opacity).toBeDefined();
    expect(opacity.value).toBe('1');
  });

  test('`:root` should still define key custom properties', () => {
    const rootRule = findRule(root, ':root');
    expect(rootRule).toBeDefined();

    const ffPoppins = rootRule.nodes.find((d) => d.prop === '--ff-poppins');
    expect(ffPoppins).toBeDefined();
    expect(ffPoppins.value).toBe("'Poppins', sans-serif");

    const fs1 = rootRule.nodes.find((d) => d.prop === '--fs-1');
    expect(fs1).toBeDefined();
    expect(fs1.value).toBe('24px');
  });

  test('`.article.active` should be visible and animate using `fade` keyframes', () => {
    const rule = findRule(root, 'article.active');
    expect(rule).toBeDefined();

    const display = rule.nodes.find((d) => d.prop === 'display');
    expect(display).toBeDefined();
    expect(display.value).toBe('block');

    const animation = rule.nodes.find((d) => d.prop === 'animation');
    expect(animation).toBeDefined();
    expect(animation.value).toBe('fade 0.5s ease backwards');
  });

  test('`@keyframes fade` should declare opacity 0 at 0% and opacity 1 at 100%', () => {
    const fadeKeyframes = root.nodes.find(
      (node) => node.type === 'atrule' && node.name === 'keyframes' && node.params === 'fade'
    );
    expect(fadeKeyframes).toBeDefined();

    const fromRule = fadeKeyframes.nodes.find((node) => node.selector === '0%');
    expect(fromRule).toBeDefined();

    const toRule = fadeKeyframes.nodes.find((node) => node.selector === '100%');
    expect(toRule).toBeDefined();

    const fromOpacity = fromRule.nodes.find((d) => d.prop === 'opacity');
    expect(fromOpacity).toBeDefined();
    expect(fromOpacity.value).toBe('0');

    const toOpacity = toRule.nodes.find((d) => d.prop === 'opacity');
    expect(toOpacity).toBeDefined();
    expect(toOpacity.value).toBe('1');
  });
});
