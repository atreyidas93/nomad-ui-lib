import type { Meta, StoryObj } from '@storybook/web-components';
import { action } from '@storybook/addon-actions';
import '../../src/components/Dropdown/NomadDropdown';

const meta: Meta = {
  title: 'Components/Dropdown',
  component: 'nomad-dropdown',
  parameters: {
    actions: { handles: ['dropdown-change', 'dropdown-open', 'dropdown-close'] },
    docs: {
      description: {
        component: `
This is the **NomadDropdown** Web Component for the NomadUI library.

## Attributes
- **options**: JSON array or comma-separated string of options
- **value**: currently selected value
- **placeholder**: placeholder text when no option selected
- **label**: dropdown label text
- **size**: \`xs | sm | md | lg | xl\` (default: md)
- **variant**: \`default | success | error | warning\` (default: default)
- **disabled**: disables the dropdown

## Events
- **dropdown-change**: Fired when selection changes
- **dropdown-open**: Fired when dropdown opens
- **dropdown-close**: Fired when dropdown closes

Example usage:

\`\`\`html
<nomad-dropdown 
  label="Select Country" 
  options='["USA", "Canada", "Mexico"]'
  placeholder="Choose a country">
</nomad-dropdown>

<!-- Or with option elements -->
<nomad-dropdown label="Select Option">
  <option>Option 1</option>
  <option>Option 2</option>
  <option>Option 3</option>
</nomad-dropdown>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    options: {
      control: 'text',
      description: 'Options as JSON array or comma-separated string',
      table: { type: { summary: 'string' } },
    },
    value: {
      control: 'text',
      description: 'Currently selected value',
      table: { type: { summary: 'string' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: { type: { summary: 'string' } },
    },
    label: {
      control: 'text',
      description: 'Dropdown label',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
      description: 'Dropdown size',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: { type: 'select', options: ['default', 'success', 'error', 'warning'] },
      description: 'Dropdown variant/state',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'default' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the dropdown',
      table: { type: { summary: 'boolean' } },
    },
  },
};

export default meta;
type Story = StoryObj;

// Helper to wire events
function wireEvents(el: Element, prefix = 'dropdown') {
  const changeLog = action(`${prefix}-change`);
  const openLog = action(`${prefix}-open`);
  const closeLog = action(`${prefix}-close`);
  
  el.addEventListener('dropdown-change', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    changeLog(detail);
    console.log(`[${prefix}-change]`, detail);
  });
  
  el.addEventListener('dropdown-open', () => {
    openLog('opened');
    console.log(`[${prefix}-open]`);
  });
  
  el.addEventListener('dropdown-close', () => {
    closeLog('closed');
    console.log(`[${prefix}-close]`);
  });
  
  return el;
}

// Stories
export const Default: Story = {
  render: () => {
    const dropdown = document.createElement('nomad-dropdown');
    dropdown.setAttribute('label', 'Select Option');
    dropdown.setAttribute('options', '["Option 1", "Option 2", "Option 3", "Option 4"]');
    dropdown.setAttribute('placeholder', 'Choose an option...');
    return wireEvents(dropdown, 'Default');
  },
};

export const WithValue: Story = {
  render: () => {
    const dropdown = document.createElement('nomad-dropdown');
    dropdown.setAttribute('label', 'Pre-selected');
    dropdown.setAttribute('options', '["Apple", "Banana", "Cherry", "Date"]');
    dropdown.setAttribute('value', 'Banana');
    return wireEvents(dropdown, 'WithValue');
  },
};

export const Countries: Story = {
  render: () => {
    const dropdown = document.createElement('nomad-dropdown');
    dropdown.setAttribute('label', 'Select Country');
    dropdown.setAttribute('options', '["United States", "Canada", "Mexico", "United Kingdom", "France", "Germany", "Japan", "Australia"]');
    dropdown.setAttribute('placeholder', 'Choose your country...');
    return wireEvents(dropdown, 'Countries');
  },
};

export const Sizes: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem; max-width: 400px;';

    ['xs', 'sm', 'md', 'lg', 'xl'].forEach((size) => {
      const dropdown = document.createElement('nomad-dropdown');
      dropdown.setAttribute('size', size);
      dropdown.setAttribute('label', `${size.toUpperCase()} Size`);
      dropdown.setAttribute('options', `["${size.toUpperCase()} Option 1", "${size.toUpperCase()} Option 2", "${size.toUpperCase()} Option 3"]`);
      dropdown.setAttribute('placeholder', `${size.toUpperCase()} placeholder`);
      wireEvents(dropdown, `Sizes/${size}`);
      container.appendChild(dropdown);
    });

    return container;
  },
};

export const Variants: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem; max-width: 300px;';

    const variants = [
      { variant: 'default', label: 'Default Dropdown' },
      { variant: 'success', label: 'Success Dropdown' },
      { variant: 'error', label: 'Error Dropdown' },
      { variant: 'warning', label: 'Warning Dropdown' },
    ];

    variants.forEach(({ variant, label }) => {
      const dropdown = document.createElement('nomad-dropdown');
      dropdown.setAttribute('variant', variant);
      dropdown.setAttribute('label', label);
      dropdown.setAttribute('options', '["Valid", "Invalid", "Pending"]');
      dropdown.setAttribute('placeholder', `${variant} state`);
      wireEvents(dropdown, `Variants/${variant}`);
      container.appendChild(dropdown);
    });

    return container;
  },
};

export const States: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem; max-width: 300px;';

    const normal = document.createElement('nomad-dropdown');
    normal.setAttribute('label', 'Normal Dropdown');
    normal.setAttribute('options', '["Option A", "Option B", "Option C"]');
    normal.setAttribute('placeholder', 'Select an option...');
    wireEvents(normal, 'States/normal');

    const withSelection = document.createElement('nomad-dropdown');
    withSelection.setAttribute('label', 'With Selection');
    withSelection.setAttribute('options', '["Red", "Green", "Blue"]');
    withSelection.setAttribute('value', 'Green');
    wireEvents(withSelection, 'States/withSelection');

    const disabled = document.createElement('nomad-dropdown');
    disabled.setAttribute('label', 'Disabled Dropdown');
    disabled.setAttribute('options', '["Disabled A", "Disabled B"]');
    disabled.setAttribute('value', 'Disabled A');
    disabled.setAttribute('disabled', '');
    wireEvents(disabled, 'States/disabled');

    container.append(normal, withSelection, disabled);
    return container;
  },
};

export const LongList: Story = {
  render: () => {
    const dropdown = document.createElement('nomad-dropdown');
    dropdown.setAttribute('label', 'Long Options List');
    
    // Create a long list of options
    const longOptions = Array.from({ length: 20 }, (_, i) => `Option ${i + 1}`);
    dropdown.setAttribute('options', JSON.stringify(longOptions));
    dropdown.setAttribute('placeholder', 'Choose from many options...');
    
    return wireEvents(dropdown, 'LongList');
  },
};

export const CommaDelimited: Story = {
  render: () => {
    const dropdown = document.createElement('nomad-dropdown');
    dropdown.setAttribute('label', 'Comma Delimited Options');
    dropdown.setAttribute('options', 'Red, Green, Blue, Yellow, Purple, Orange');
    dropdown.setAttribute('placeholder', 'Pick a color...');
    return wireEvents(dropdown, 'CommaDelimited');
  },
};