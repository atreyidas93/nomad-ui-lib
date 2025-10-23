import type { Meta, StoryObj } from '@storybook/web-components';
import { action } from '@storybook/addon-actions';
import '../../src/components/Navigation/NomadNavigation';

const meta: Meta = {
  title: 'Components/Navigation',
  component: 'nomad-navigation',
  parameters: {
    actions: { handles: ['nav-click', 'nav-menu-open', 'nav-menu-close'] },
    docs: {
      description: {
        component: `
This is the **NomadNavigation** Web Component for the NomadUI library.

## Attributes
- **brand**: brand/logo text for the navigation
- **variant**: \`light | dark | primary | transparent\` (default: light)
- **position**: \`static | fixed | sticky\` (default: static)
- **nav-items**: JSON array of navigation items
- **mobile-breakpoint**: CSS breakpoint for mobile menu (default: 768px)

## Events
- **nav-click**: Fired when a navigation link is clicked
- **nav-menu-open**: Fired when mobile menu opens
- **nav-menu-close**: Fired when mobile menu closes

## Navigation Items Format
\`\`\`json
[
  { "label": "Home", "href": "/", "active": true },
  { "label": "About", "href": "/about" },
  { "label": "Contact", "href": "/contact" },
  { "label": "External", "href": "https://example.com", "target": "_blank" }
]
\`\`\`

## Usage Examples

### With nav-items attribute:
\`\`\`html
<nomad-navigation 
  brand="MyApp" 
  variant="dark" 
  nav-items='[{"label":"Home","href":"/"},{"label":"About","href":"/about"}]'>
</nomad-navigation>
\`\`\`

### With slot content:
\`\`\`html
<nomad-navigation brand="MyApp" variant="primary">
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nomad-navigation>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    brand: {
      control: 'text',
      description: 'Brand/logo text',
      table: { type: { summary: 'string' } },
    },
    variant: {
      control: { type: 'select', options: ['light', 'dark', 'primary', 'transparent'] },
      description: 'Navigation variant/theme',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'light' } },
    },
    position: {
      control: { type: 'select', options: ['static', 'fixed', 'sticky'] },
      description: 'Navigation positioning',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'static' } },
    },
    'nav-items': {
      control: 'text',
      description: 'JSON array of navigation items',
      table: { type: { summary: 'string' } },
    },
    'mobile-breakpoint': {
      control: 'text',
      description: 'CSS breakpoint for mobile menu',
      table: { type: { summary: 'string' }, defaultValue: { summary: '768px' } },
    },
  },
};

export default meta;
type Story = StoryObj;

// Helper to wire events
function wireEvents(el: Element, prefix = 'nav') {
  const clickLog = action(`${prefix}-click`);
  const openLog = action(`${prefix}-menu-open`);
  const closeLog = action(`${prefix}-menu-close`);
  
  el.addEventListener('nav-click', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    clickLog(detail);
    console.log(`[${prefix}-click]`, detail);
  });
  
  el.addEventListener('nav-menu-open', () => {
    openLog('opened');
    console.log(`[${prefix}-menu-open]`);
  });
  
  el.addEventListener('nav-menu-close', () => {
    closeLog('closed');
    console.log(`[${prefix}-menu-close]`);
  });
  
  return el;
}

// Sample navigation items
const sampleNavItems = [
  { label: 'Home', href: '/', active: true },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' }
];

// Stories
export const Default: Story = {
  render: () => {
    const nav = document.createElement('nomad-navigation');
    nav.setAttribute('brand', 'NomadUI');
    nav.setAttribute('nav-items', JSON.stringify(sampleNavItems));
    return wireEvents(nav, 'Default');
  },
};

export const Variants: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 2rem;';

    const variants = [
      { variant: 'light', label: 'Light Navigation' },
      { variant: 'dark', label: 'Dark Navigation' },
      { variant: 'primary', label: 'Primary Navigation' },
      { variant: 'transparent', label: 'Transparent Navigation' },
    ];

    variants.forEach(({ variant, label }) => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `<h3>${label}</h3>`;
      
      const nav = document.createElement('nomad-navigation');
      nav.setAttribute('brand', 'Brand');
      nav.setAttribute('variant', variant);
      nav.setAttribute('nav-items', JSON.stringify([
        { label: 'Home', href: '/', active: true },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
      ]));
      
      wireEvents(nav, `Variants/${variant}`);
      wrapper.appendChild(nav);
      container.appendChild(wrapper);
    });

    return container;
  },
};

export const WithSlotContent: Story = {
  render: () => {
    const nav = document.createElement('nomad-navigation');
    nav.setAttribute('brand', 'MyApp');
    nav.setAttribute('variant', 'dark');
    
    // Add slot content
    nav.innerHTML = `
      <a href="/" style="color: inherit; text-decoration: none; padding: 0.5rem 0;">Home</a>
      <a href="/products" style="color: inherit; text-decoration: none; padding: 0.5rem 0;">Products</a>
      <a href="/about" style="color: inherit; text-decoration: none; padding: 0.5rem 0;">About</a>
      <a href="/contact" style="color: inherit; text-decoration: none; padding: 0.5rem 0;">Contact</a>
    `;
    
    return wireEvents(nav, 'SlotContent');
  },
};

export const Positions: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 2rem; height: 400px; overflow: hidden; border: 1px solid #ccc; position: relative;';

    // Static navigation (default)
    const staticNav = document.createElement('nomad-navigation');
    staticNav.setAttribute('brand', 'Static Nav');
    staticNav.setAttribute('position', 'static');
    staticNav.setAttribute('nav-items', JSON.stringify([
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' }
    ]));
    wireEvents(staticNav, 'Positions/static');

    // Content to show scrolling behavior
    const content = document.createElement('div');
    content.style.cssText = 'padding: 2rem; background: linear-gradient(45deg, #f0f0f0, #e0e0e0); flex: 1;';
    content.innerHTML = `
      <h2>Page Content</h2>
      <p>This content demonstrates how navigation positioning works.</p>
      <p>Scroll to see sticky behavior in the Sticky Navigation story.</p>
      <p>The navigation above uses <code>position="static"</code> (default).</p>
    `;

    container.appendChild(staticNav);
    container.appendChild(content);
    return container;
  },
};

export const StickyNavigation: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'height: 400px; overflow-y: auto; border: 1px solid #ccc;';

    const nav = document.createElement('nomad-navigation');
    nav.setAttribute('brand', 'Sticky Nav');
    nav.setAttribute('variant', 'primary');
    nav.setAttribute('position', 'sticky');
    nav.setAttribute('nav-items', JSON.stringify([
      { label: 'Home', href: '/', active: true },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' }
    ]));
    wireEvents(nav, 'StickyNav');

    const content = document.createElement('div');
    content.style.cssText = 'padding: 2rem;';
    content.innerHTML = `
      <h2>Sticky Navigation Demo</h2>
      <p>Scroll down to see the navigation stick to the top!</p>
      ${Array.from({ length: 20 }, (_, i) => `<p>This is paragraph ${i + 1}. Keep scrolling to see the sticky navigation in action.</p>`).join('')}
    `;

    container.appendChild(nav);
    container.appendChild(content);
    return container;
  },
};

export const MobileResponsive: Story = {
  render: () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <p><strong>Resize your browser window</strong> or use the viewport controls to see mobile responsive behavior.</p>
      <p>On mobile screens, a hamburger menu will appear and the navigation items will stack vertically.</p>
    `;
    
    const nav = document.createElement('nomad-navigation');
    nav.setAttribute('brand', 'Responsive');
    nav.setAttribute('variant', 'dark');
    nav.setAttribute('nav-items', JSON.stringify([
      { label: 'Dashboard', href: '/dashboard', active: true },
      { label: 'Analytics', href: '/analytics' },
      { label: 'Reports', href: '/reports' },
      { label: 'Settings', href: '/settings' },
      { label: 'Help', href: '/help' }
    ]));
    
    wireEvents(nav, 'MobileResponsive');
    container.appendChild(nav);
    return container;
  },
};

export const EcommerceExample: Story = {
  render: () => {
    const nav = document.createElement('nomad-navigation');
    nav.setAttribute('brand', 'ShopUI');
    nav.setAttribute('variant', 'light');
    nav.setAttribute('nav-items', JSON.stringify([
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop', active: true },
      { label: 'Categories', href: '/categories' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' }
    ]));
    
    return wireEvents(nav, 'Ecommerce');
  },
};

export const WithExternalLinks: Story = {
  render: () => {
    const nav = document.createElement('nomad-navigation');
    nav.setAttribute('brand', 'External Links');
    nav.setAttribute('variant', 'primary');
    nav.setAttribute('nav-items', JSON.stringify([
      { label: 'Home', href: '/' },
      { label: 'Docs', href: 'https://storybook.js.org', target: '_blank' },
      { label: 'GitHub', href: 'https://github.com', target: '_blank' },
      { label: 'About', href: '/about' }
    ]));
    
    return wireEvents(nav, 'ExternalLinks');
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const container = document.createElement('div');
    
    const nav = document.createElement('nomad-navigation');
    nav.setAttribute('brand', 'Interactive Demo');
    nav.setAttribute('variant', 'dark');
    nav.setAttribute('nav-items', JSON.stringify([
      { label: 'Home', href: '/', active: true },
      { label: 'Products', href: '/products' },
      { label: 'Services', href: '/services' },
      { label: 'Contact', href: '/contact' }
    ]));
    
    const controls = document.createElement('div');
    controls.style.cssText = 'padding: 2rem; background: #f5f5f5; margin-top: 1rem;';
    controls.innerHTML = `
      <h3>Interactive Controls</h3>
      <p>Try these actions:</p>
    `;
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = 'display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;';
    
    // Set active button
    const setActiveBtn = document.createElement('button');
    setActiveBtn.textContent = 'Set Products Active';
    setActiveBtn.style.cssText = 'padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;';
    setActiveBtn.addEventListener('click', () => {
      (nav as any).setActiveItem('/products');
    });
    
    // Toggle mobile menu (for demonstration)
    const toggleMobileBtn = document.createElement('button');
    toggleMobileBtn.textContent = 'Toggle Mobile Menu';
    toggleMobileBtn.style.cssText = 'padding: 0.5rem 1rem; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer;';
    toggleMobileBtn.addEventListener('click', () => {
      (nav as any).toggleMobileMenu();
    });
    
    buttonsContainer.append(setActiveBtn, toggleMobileBtn);
    controls.appendChild(buttonsContainer);
    
    wireEvents(nav, 'Interactive');
    container.appendChild(nav);
    container.appendChild(controls);
    return container;
  },
};