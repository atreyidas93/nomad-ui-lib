import type { Meta, StoryObj } from '@storybook/web-components';
import { action } from '@storybook/addon-actions';
import '../../src/components/Toast/NomadToast';

// Import the class for static methods
import { NomadToast } from '../../src/components/Toast/NomadToast';

const meta: Meta = {
  title: 'Components/Toast',
  component: 'nomad-toast',
  parameters: {
    actions: { handles: ['toast-show', 'toast-hide'] },
    docs: {
      description: {
        component: `
This is the **NomadToast** Web Component for the NomadUI library.

## Attributes
- **message**: notification text content
- **variant**: \`success | error | warning | info\` (default: info)
- **duration**: auto-hide duration in milliseconds (default: 4000, set 0 to disable)
- **position**: \`top-left | top-center | top-right | bottom-left | bottom-center | bottom-right\` (default: top-right)
- **closable**: shows close button when present
- **show**: controls visibility

## Events
- **toast-show**: Fired when toast is shown
- **toast-hide**: Fired when toast is hidden

## Static Methods
Convenient methods for showing toasts:

\`\`\`javascript
// Simple usage
NomadToast.success('Operation completed!');
NomadToast.error('Something went wrong!');
NomadToast.warning('Please check your input');
NomadToast.info('New updates available');

// With options
NomadToast.success('Saved successfully!', {
  duration: 3000,
  position: 'bottom-center',
  closable: true
});
\`\`\`

## Manual Usage
\`\`\`html
<nomad-toast 
  message="Hello World!" 
  variant="success" 
  position="top-center" 
  closable 
  show>
</nomad-toast>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    message: {
      control: 'text',
      description: 'Toast message text',
      table: { type: { summary: 'string' } },
    },
    variant: {
      control: { type: 'select', options: ['success', 'error', 'warning', 'info'] },
      description: 'Toast variant/type',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'info' } },
    },
    duration: {
      control: 'number',
      description: 'Auto-hide duration in ms (0 = no auto-hide)',
      table: { type: { summary: 'number' }, defaultValue: { summary: '4000' } },
    },
    position: {
      control: { type: 'select', options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] },
      description: 'Toast position on screen',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'top-right' } },
    },
    closable: {
      control: 'boolean',
      description: 'Shows close button',
      table: { type: { summary: 'boolean' } },
    },
  },
};

export default meta;
type Story = StoryObj;

// Helper to wire events
function wireEvents(el: Element, prefix = 'toast') {
  const showLog = action(`${prefix}-show`);
  const hideLog = action(`${prefix}-hide`);
  
  el.addEventListener('toast-show', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    showLog(detail);
    console.log(`[${prefix}-show]`, detail);
  });
  
  el.addEventListener('toast-hide', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    hideLog(detail);
    console.log(`[${prefix}-hide]`, detail);
  });
  
  return el;
}

// Stories
export const Default: Story = {
  render: () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <p>Toast notifications appear as overlays. Click the buttons below to trigger toasts:</p>
    `;
    return container;
  },
};

export const Variants: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 1rem; flex-wrap: wrap; margin: 2rem 0;';

    const variants = [
      { variant: 'success', message: 'Operation completed successfully!' },
      { variant: 'error', message: 'An error occurred while processing' },
      { variant: 'warning', message: 'Please check your input data' },
      { variant: 'info', message: 'New updates are available for download' },
    ];

    variants.forEach(({ variant, message }) => {
      const button = document.createElement('button');
      button.textContent = `Show ${variant}`;
      button.style.cssText = 'padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;';
      
      button.addEventListener('click', () => {
        (NomadToast as any)[variant](message, { closable: true });
      });
      
      container.appendChild(button);
    });

    return container;
  },
};

export const Positions: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 2rem 0;';

    const positions = [
      'top-left', 'top-center', 'top-right',
      'bottom-left', 'bottom-center', 'bottom-right'
    ];

    positions.forEach((position) => {
      const button = document.createElement('button');
      button.textContent = position;
      button.style.cssText = 'padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;';
      
      button.addEventListener('click', () => {
        NomadToast.info(`Toast from ${position}`, { position, closable: true });
      });
      
      container.appendChild(button);
    });

    return container;
  },
};

export const AutoHide: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 1rem; flex-wrap: wrap; margin: 2rem 0;';

    const durations = [
      { duration: 1000, label: '1 second' },
      { duration: 3000, label: '3 seconds' },
      { duration: 0, label: 'No auto-hide' },
    ];

    durations.forEach(({ duration, label }) => {
      const button = document.createElement('button');
      button.textContent = label;
      button.style.cssText = 'padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;';
      
      button.addEventListener('click', () => {
        NomadToast.info(`This toast ${duration === 0 ? 'stays visible' : `hides after ${duration}ms`}`, {
          duration,
          closable: duration === 0 // Only show close button for persistent toasts
        });
      });
      
      container.appendChild(button);
    });

    return container;
  },
};

export const Interactive: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'margin: 2rem 0;';
    
    container.innerHTML = `
      <h3>Interactive Toast Demo</h3>
      <p>Try these different toast interactions:</p>
    `;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = 'display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;';

    // Quick success toast
    const successBtn = document.createElement('button');
    successBtn.textContent = 'Quick Success';
    successBtn.style.cssText = 'padding: 0.5rem 1rem; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;';
    successBtn.addEventListener('click', () => {
      NomadToast.success('Form saved successfully!', { duration: 2000 });
    });

    // Persistent error
    const errorBtn = document.createElement('button');
    errorBtn.textContent = 'Persistent Error';
    errorBtn.style.cssText = 'padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;';
    errorBtn.addEventListener('click', () => {
      NomadToast.error('Connection failed. Please try again.', { 
        duration: 0, 
        closable: true,
        position: 'bottom-center'
      });
    });

    // Warning with action
    const warningBtn = document.createElement('button');
    warningBtn.textContent = 'Show Warning';
    warningBtn.style.cssText = 'padding: 0.5rem 1rem; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer;';
    warningBtn.addEventListener('click', () => {
      NomadToast.warning('Unsaved changes will be lost', {
        duration: 5000,
        closable: true,
        position: 'top-center'
      });
    });

    // Multiple toasts
    const multiBtn = document.createElement('button');
    multiBtn.textContent = 'Show Multiple';
    multiBtn.style.cssText = 'padding: 0.5rem 1rem; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer;';
    multiBtn.addEventListener('click', () => {
      NomadToast.info('First toast', { position: 'top-left', duration: 3000 });
      setTimeout(() => NomadToast.success('Second toast', { position: 'top-right', duration: 3000 }), 500);
      setTimeout(() => NomadToast.warning('Third toast', { position: 'bottom-center', duration: 3000 }), 1000);
    });

    buttonsContainer.append(successBtn, errorBtn, warningBtn, multiBtn);
    container.appendChild(buttonsContainer);

    return container;
  },
};

export const StaticToast: Story = {
  render: () => {
    const toast = document.createElement('nomad-toast');
    toast.setAttribute('message', 'This is a static toast for documentation');
    toast.setAttribute('variant', 'info');
    toast.setAttribute('position', 'top-center');
    toast.setAttribute('closable', '');
    toast.setAttribute('show', '');
    toast.setAttribute('duration', '0'); // Don't auto-hide for demo
    
    wireEvents(toast, 'Static');
    
    // Position it in a container instead of fixed positioning
    const container = document.createElement('div');
    container.style.cssText = 'position: relative; height: 100px; background: #f5f5f5; border-radius: 4px; margin: 2rem 0;';
    
    // Override the fixed positioning for demo
    toast.style.cssText = 'position: absolute !important; top: 10px !important; left: 50% !important; transform: translateX(-50%) !important;';
    
    container.appendChild(toast);
    return container;
  },
};