/* stories/components/NomadButton.stories.ts */

import type { Meta, StoryObj } from '@storybook/web-components';
import { action } from '@storybook/addon-actions';
import '../../src/components/button/NomadButton';

const meta: Meta = {
  title: 'Components/Button',
  component: 'nomad-button',
  parameters: {
    actions: { handles: ['button-click'] },
    docs: {
      description: {
        component: `
This is the **NomadButton** Web Component for the NomadUI library.

## Attributes
- **variant**: \`primary | secondary | success | danger | warning | info\`
- **size**: \`xs | sm | md | lg | xl\`
- **label**: text label of the button
- **disabled**: disables the button
- **loading**: shows a loading spinner and disables the button

## Event: \`button-click\`
Fired when the button is clicked and is not disabled or loading.

\`\`\`ts
interface ButtonClickDetail {
  variant: string;
  size: string;
}
\`\`\`

Example usage:

\`\`\`html
<nomad-button label="Click me"></nomad-button>
<script>
  const btn = document.querySelector('nomad-button');
  btn.addEventListener('button-click', (e) => {
    console.log('Button clicked!', e.detail.variant, e.detail.size);
  });
</script>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select', options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'] },
      description: 'Sets the button style variant',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'primary' } },
    },
    size: {
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
      description: 'Sets the button size',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'md' } },
    },
    label: {
      control: 'text',
      description: 'Button text label',
      table: { type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
      table: { type: { summary: 'boolean' } },
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables the button',
      table: { type: { summary: 'boolean' } },
    },
  },
};

export default meta;
type Story = StoryObj;

// ----------------------
// Helper to bind Actions & console log
// ----------------------
function wireClick(el: Element, label = 'button-click') {
  const log = action(label);
  el.addEventListener('button-click', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    log(detail);                         // -> shows in Actions panel
    console.log(`[${label}]`, detail);    // -> browser console
  });
  return el;
}

// ----------------------
// Stories
// ----------------------
export const Default: Story = {
  render: () => {
    const button = document.createElement('nomad-button');
    button.textContent = 'Default Button';
    return wireClick(button, 'Default/button-click');
  },
};

export const Variants: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 1rem; flex-wrap: wrap;';

    ['primary', 'secondary', 'success', 'danger', 'warning', 'info'].forEach((variant) => {
      const btn = document.createElement('nomad-button');
      btn.setAttribute('variant', variant);
      btn.textContent = variant;
      wireClick(btn, `Variants/${variant}`);
      container.appendChild(btn);
    });

    return container;
  },
};

export const Sizes: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 1rem; align-items: center;';

    ['xs', 'sm', 'md', 'lg', 'xl'].forEach((size) => {
      const btn = document.createElement('nomad-button');
      btn.setAttribute('size', size);
      btn.textContent = size.toUpperCase();
      wireClick(btn, `Sizes/${size}`);
      container.appendChild(btn);
    });

    return container;
  },
};

export const States: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 1rem;';

    const normal = document.createElement('nomad-button');
    normal.textContent = 'Normal';
    wireClick(normal, 'States/normal');

    const loading = document.createElement('nomad-button');
    loading.setAttribute('loading', '');
    loading.textContent = 'Loading';
    wireClick(loading, 'States/loading');

    const disabled = document.createElement('nomad-button');
    disabled.setAttribute('disabled', '');
    disabled.textContent = 'Disabled';
    wireClick(disabled, 'States/disabled');

    container.append(normal, loading, disabled);
    return container;
  },
};