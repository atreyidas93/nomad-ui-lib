import type { Meta, StoryObj } from '@storybook/web-components';
import { action } from '@storybook/addon-actions';
import '../../src/components/Input/NomadInput';

const meta: Meta = {
  title: 'Components/Input',
  component: 'nomad-input',
  parameters: {
    actions: { handles: ['input-change', 'input-focus', 'input-blur'] },
    docs: {
      description: {
        component: `
This is the **NomadInput** Web Component for the NomadUI library.

## Attributes
- **type**: \`text | email | password | number | tel | url\` (default: text)
- **size**: \`xs | sm | md | lg | xl\` (default: md)
- **variant**: \`default | success | error | warning\` (default: default)
- **label**: input label text
- **placeholder**: placeholder text
- **value**: input value
- **disabled**: disables the input
- **required**: marks input as required

## Events
- **input-change**: Fired when input value changes
- **input-focus**: Fired when input gains focus  
- **input-blur**: Fired when input loses focus

## Callback Properties
- **onInputChange**: Function called when input value changes
- **onInputFocus**: Function called when input gains focus
- **onInputBlur**: Function called when input loses focus

## Usage Examples

### Event Listener Approach:
\`\`\`html
<nomad-input label="Email" type="email" placeholder="Enter your email"></nomad-input>
<script>
  const input = document.querySelector('nomad-input');
  input.addEventListener('input-change', (e) => {
    console.log('Value changed:', e.detail.value);
  });
  input.addEventListener('input-focus', (e) => {
    console.log('Input focused:', e.detail);
  });
  input.addEventListener('input-blur', (e) => {
    console.log('Input blurred:', e.detail);
  });
</script>
\`\`\`

### Callback Approach:
\`\`\`html
<nomad-input id="my-input" label="Email" type="email" placeholder="Enter your email"></nomad-input>
<script>
  const input = document.getElementById('my-input');
  input.onInputChange = (data) => {
    console.log('Value changed:', data.value);
  };
  input.onInputFocus = (data) => {
    console.log('Input focused:', data);
  };
  input.onInputBlur = (data) => {
    console.log('Input blurred:', data);
  };
</script>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select', options: ['text', 'email', 'password', 'number', 'tel', 'url'] },
      description: 'Input type',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'text' } },
    },
    size: {
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
      description: 'Input size',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'md' } },
    },
    variant: {
      control: { type: 'select', options: ['default', 'success', 'error', 'warning'] },
      description: 'Input variant/state',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'default' } },
    },
    label: {
      control: 'text',
      description: 'Input label',
      table: { type: { summary: 'string' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: { type: { summary: 'string' } },
    },
    value: {
      control: 'text',
      description: 'Input value',
      table: { type: { summary: 'string' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
      table: { type: { summary: 'boolean' } },
    },
    required: {
      control: 'boolean',
      description: 'Marks input as required',
      table: { type: { summary: 'boolean' } },
    },
  },
};

export default meta;
type Story = StoryObj;

// Helper to wire both events and callbacks
function wireEventsAndCallbacks(el: Element, prefix = 'input') {
  const changeLog = action(`${prefix}-change`);
  const focusLog = action(`${prefix}-focus`);
  const blurLog = action(`${prefix}-blur`);
  
  // Event listener approach
  el.addEventListener('input-change', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    changeLog(detail);
    console.log(`[${prefix}-change] Event:`, detail);
  });
  
  el.addEventListener('input-focus', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    focusLog(detail);
    console.log(`[${prefix}-focus] Event:`, detail);
  });
  
  el.addEventListener('input-blur', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    blurLog(detail);
    console.log(`[${prefix}-blur] Event:`, detail);
  });
  
  // Callback approach (overwrites event logs to show difference)
  if (el as any) {
    (el as any).onInputChange = (data: any) => {
      changeLog(data);
      console.log(`[${prefix}-change] Callback:`, data);
    };
    
    (el as any).onInputFocus = (data: any) => {
      focusLog(data);
      console.log(`[${prefix}-focus] Callback:`, data);
    };
    
    (el as any).onInputBlur = (data: any) => {
      blurLog(data);
      console.log(`[${prefix}-blur] Callback:`, data);
    };
  }
  
  return el;
}

// Helper for event listener only
function wireEvents(el: Element, prefix = 'input') {
  const changeLog = action(`${prefix}-change`);
  const focusLog = action(`${prefix}-focus`);
  const blurLog = action(`${prefix}-blur`);
  
  el.addEventListener('input-change', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    changeLog(detail);
    console.log(`[${prefix}-change]`, detail);
  });
  
  el.addEventListener('input-focus', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    focusLog(detail);
    console.log(`[${prefix}-focus]`, detail);
  });
  
  el.addEventListener('input-blur', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    blurLog(detail);
    console.log(`[${prefix}-blur]`, detail);
  });
  
  return el;
}

// Stories
export const Default: Story = {
  render: () => {
    const input = document.createElement('nomad-input');
    input.setAttribute('label', 'Default Input');
    input.setAttribute('placeholder', 'Enter text here...');
    return wireEventsAndCallbacks(input, 'Default');
  },
};

export const CallbackExample: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem; max-width: 400px;';
    
    const title = document.createElement('h3');
    title.textContent = 'Callback Properties Demo';
    title.style.margin = '0 0 1rem 0';
    
    const description = document.createElement('p');
    description.textContent = 'Type in the input below and check the Actions tab to see callback functions being called.';
    description.style.margin = '0 0 1rem 0';
    description.style.fontSize = '14px';
    description.style.color = '#666';
    
    const input = document.createElement('nomad-input');
    input.setAttribute('label', 'Callback Demo');
    input.setAttribute('placeholder', 'Type here to see callbacks...');
    
    // Use callback approach for this story
    (input as any).onInputChange = (data: any) => {
      action('callback-change')(data);
      console.log('Callback - Value changed:', data.value);
    };
    
    (input as any).onInputFocus = (data: any) => {
      action('callback-focus')(data);
      console.log('Callback - Input focused:', data);
    };
    
    (input as any).onInputBlur = (data: any) => {
      action('callback-blur')(data);
      console.log('Callback - Input blurred:', data);
    };
    
    container.append(title, description, input);
    return container;
  },
};

export const EventListenerExample: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem; max-width: 400px;';
    
    const title = document.createElement('h3');
    title.textContent = 'Event Listener Demo';
    title.style.margin = '0 0 1rem 0';
    
    const description = document.createElement('p');
    description.textContent = 'Traditional event listener approach - check Actions tab and console.';
    description.style.margin = '0 0 1rem 0';
    description.style.fontSize = '14px';
    description.style.color = '#666';
    
    const input = document.createElement('nomad-input');
    input.setAttribute('label', 'Event Listener Demo');
    input.setAttribute('placeholder', 'Type here to see events...');
    
    wireEvents(input, 'EventListener');
    
    container.append(title, description, input);
    return container;
  },
};

export const Types: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem; max-width: 300px;';

    const types = [
      { type: 'text', label: 'Text Input', placeholder: 'Enter text' },
      { type: 'email', label: 'Email Input', placeholder: 'Enter email' },
      { type: 'password', label: 'Password Input', placeholder: 'Enter password' },
      { type: 'number', label: 'Number Input', placeholder: 'Enter number' },
      { type: 'tel', label: 'Phone Input', placeholder: 'Enter phone' },
      { type: 'url', label: 'URL Input', placeholder: 'Enter URL' },
    ];

    types.forEach(({ type, label, placeholder }) => {
      const input = document.createElement('nomad-input');
      input.setAttribute('type', type);
      input.setAttribute('label', label);
      input.setAttribute('placeholder', placeholder);
      wireEventsAndCallbacks(input, `Types/${type}`);
      container.appendChild(input);
    });

    return container;
  },
};

export const Sizes: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem; max-width: 400px;';

    ['xs', 'sm', 'md', 'lg', 'xl'].forEach((size) => {
      const input = document.createElement('nomad-input');
      input.setAttribute('size', size);
      input.setAttribute('label', `${size.toUpperCase()} Size`);
      input.setAttribute('placeholder', `${size.toUpperCase()} placeholder`);
      wireEventsAndCallbacks(input, `Sizes/${size}`);
      container.appendChild(input);
    });

    return container;
  },
};

export const Variants: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem; max-width: 300px;';

    const variants = [
      { variant: 'default', label: 'Default Input' },
      { variant: 'success', label: 'Success Input' },
      { variant: 'error', label: 'Error Input' },
      { variant: 'warning', label: 'Warning Input' },
    ];

    variants.forEach(({ variant, label }) => {
      const input = document.createElement('nomad-input');
      input.setAttribute('variant', variant);
      input.setAttribute('label', label);
      input.setAttribute('placeholder', `${variant} state`);
      wireEventsAndCallbacks(input, `Variants/${variant}`);
      container.appendChild(input);
    });

    return container;
  },
};

export const States: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem; max-width: 300px;';

    const normal = document.createElement('nomad-input');
    normal.setAttribute('label', 'Normal Input');
    normal.setAttribute('placeholder', 'Type something...');
    wireEventsAndCallbacks(normal, 'States/normal');

    const withValue = document.createElement('nomad-input');
    withValue.setAttribute('label', 'With Value');
    withValue.setAttribute('value', 'Pre-filled value');
    wireEventsAndCallbacks(withValue, 'States/withValue');

    const required = document.createElement('nomad-input');
    required.setAttribute('label', 'Required Input *');
    required.setAttribute('placeholder', 'This field is required');
    required.setAttribute('required', '');
    wireEventsAndCallbacks(required, 'States/required');

    const disabled = document.createElement('nomad-input');
    disabled.setAttribute('label', 'Disabled Input');
    disabled.setAttribute('value', 'Cannot edit this');
    disabled.setAttribute('disabled', '');
    wireEventsAndCallbacks(disabled, 'States/disabled');

    container.append(normal, withValue, required, disabled);
    return container;
  },
};

export const ValidationDemo: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; flex-direction: column; gap: 1rem; max-width: 400px;';
    
    const title = document.createElement('h3');
    title.textContent = 'Real-time Validation Demo';
    title.style.margin = '0 0 1rem 0';
    
    const description = document.createElement('p');
    description.textContent = 'Try typing invalid/valid emails to see variant changes in real-time.';
    description.style.margin = '0 0 1rem 0';
    description.style.fontSize = '14px';
    description.style.color = '#666';
    
    const emailInput = document.createElement('nomad-input');
    emailInput.setAttribute('type', 'email');
    emailInput.setAttribute('label', 'Email Validation');
    emailInput.setAttribute('placeholder', 'Enter email address...');
    
    // Real-time email validation using callback
    (emailInput as any).onInputChange = (data: any) => {
      const email = data.value;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(email);
      
      if (email.length === 0) {
        emailInput.setAttribute('variant', 'default');
      } else if (isValid) {
        emailInput.setAttribute('variant', 'success');
      } else {
        emailInput.setAttribute('variant', 'error');
      }
      
      action('validation-change')({
        email: email,
        isValid: isValid,
        variant: email.length === 0 ? 'default' : (isValid ? 'success' : 'error')
      });
    };
    
    (emailInput as any).onInputFocus = (data: any) => {
      action('validation-focus')(data);
    };
    
    (emailInput as any).onInputBlur = (data: any) => {
      action('validation-blur')(data);
    };
    
    container.append(title, description, emailInput);
    return container;
  },
};