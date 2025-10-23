import type { Meta, StoryObj } from '@storybook/web-components';
import { action } from '@storybook/addon-actions';
import '../../src/components/Modal/NomadModal';

// Import the class for static methods
import { NomadModal } from '../../src/components/Modal/NomadModal';

const meta: Meta = {
  title: 'Components/Modal',
  component: 'nomad-modal',
  parameters: {
    actions: { handles: ['modal-open', 'modal-close'] },
    docs: {
      description: {
        component: `
This is the **NomadModal** Web Component for the NomadUI library.

## Attributes
- **open**: controls modal visibility
- **title**: modal title text
- **size**: \`xs | sm | md | lg | xl | full\` (default: md)
- **closable**: shows close button when present
- **backdrop-close**: allows closing by clicking backdrop
- **persistent**: prevents auto-removal from DOM after closing

## Events
- **modal-open**: Fired when modal opens
- **modal-close**: Fired when modal closes

## Slots
- **default/body**: main modal content
- **footer**: modal footer content (buttons, actions)

## Static Methods
Convenient methods for common modal patterns:

\`\`\`javascript
// Simple modal
NomadModal.show('<p>Hello World!</p>', {
  title: 'Greeting',
  size: 'sm',
  closable: true,
  backdropClose: true
});

// Confirmation dialog
const confirmed = await NomadModal.confirm('Are you sure?', {
  title: 'Delete Item',
  confirmText: 'Delete',
  cancelText: 'Cancel'
});

// Alert dialog
await NomadModal.alert('Operation completed successfully!', {
  title: 'Success',
  buttonText: 'OK'
});
\`\`\`

## Manual Usage
\`\`\`html
<nomad-modal title="My Modal" size="lg" closable backdrop-close>
  <div slot="body">
    <p>Modal content goes here...</p>
  </div>
  <div slot="footer">
    <button onclick="this.closest('nomad-modal').close()">Close</button>
  </div>
</nomad-modal>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Modal title text',
      table: { type: { summary: 'string' } },
    },
    size: {
      control: { type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'] },
      description: 'Modal size',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'md' } },
    },
    closable: {
      control: 'boolean',
      description: 'Shows close button',
      table: { type: { summary: 'boolean' } },
    },
    'backdrop-close': {
      control: 'boolean',
      description: 'Allows closing by clicking backdrop',
      table: { type: { summary: 'boolean' } },
    },
    persistent: {
      control: 'boolean',
      description: 'Prevents auto-removal from DOM',
      table: { type: { summary: 'boolean' } },
    },
  },
};

export default meta;
type Story = StoryObj;

// Helper to wire events
function wireEvents(el: Element, prefix = 'modal') {
  const openLog = action(`${prefix}-open`);
  const closeLog = action(`${prefix}-close`);
  
  el.addEventListener('modal-open', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    openLog(detail);
    console.log(`[${prefix}-open]`, detail);
  });
  
  el.addEventListener('modal-close', (ev: Event) => {
    const detail = (ev as CustomEvent).detail;
    closeLog(detail);
    console.log(`[${prefix}-close]`, detail);
  });
  
  return el;
}

// Stories
export const Default: Story = {
  render: () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <p>Click the button below to open a modal:</p>
    `;
    
    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open Modal';
    openBtn.style.cssText = 'padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;';
    
    openBtn.addEventListener('click', () => {
      NomadModal.show(`
        <p>This is a simple modal with basic content.</p>
        <p>You can put any HTML content here.</p>
      `, {
        title: 'Default Modal',
        closable: true,
        backdropClose: true
      });
    });
    
    container.appendChild(openBtn);
    return container;
  },
};

export const Sizes: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 1rem; flex-wrap: wrap;';

    const sizes = [
      { size: 'xs', label: 'Extra Small' },
      { size: 'sm', label: 'Small' },
      { size: 'md', label: 'Medium' },
      { size: 'lg', label: 'Large' },
      { size: 'xl', label: 'Extra Large' },
      { size: 'full', label: 'Full Screen' },
    ];

    sizes.forEach(({ size, label }) => {
      const button = document.createElement('button');
      button.textContent = label;
      button.style.cssText = 'padding: 0.5rem 1rem; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;';
      
      button.addEventListener('click', () => {
        NomadModal.show(`
          <p>This is a <strong>${size.toUpperCase()}</strong> modal.</p>
          <p>Different sizes help accommodate different amounts of content.</p>
          ${size === 'full' ? '<p>Full-screen modals are great for complex forms or detailed content.</p>' : ''}
        `, {
          title: `${label} Modal`,
          size,
          closable: true,
          backdropClose: true
        });
      });
      
      container.appendChild(button);
    });

    return container;
  },
};

export const WithFooter: Story = {
  render: () => {
    const container = document.createElement('div');
    
    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open Modal with Footer';
    openBtn.style.cssText = 'padding: 0.5rem 1rem; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;';
    
    openBtn.addEventListener('click', () => {
      const modal = document.createElement('nomad-modal');
      modal.setAttribute('title', 'Modal with Footer');
      modal.setAttribute('size', 'md');
      modal.setAttribute('closable', '');
      modal.setAttribute('backdrop-close', '');
      
      modal.innerHTML = `
        <div slot="body">
          <p>This modal demonstrates custom footer content with multiple buttons.</p>
          <p>The footer is useful for action buttons like Save, Cancel, etc.</p>
        </div>
        <div slot="footer">
          <button class="cancel-btn" style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; background: white; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">
            Cancel
          </button>
          <button class="save-btn" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Save Changes
          </button>
        </div>
      `;
      
      modal.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('cancel-btn') || target.classList.contains('save-btn')) {
          (modal as any).close();
        }
      });
      
      wireEvents(modal, 'WithFooter');
      document.body.appendChild(modal);
      (modal as any).open();
    });
    
    container.appendChild(openBtn);
    return container;
  },
};

export const ConfirmationDialog: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 1rem; flex-wrap: wrap;';

    // Confirmation dialog
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Delete Item';
    confirmBtn.style.cssText = 'padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;';
    
    confirmBtn.addEventListener('click', async () => {
      const confirmed = await NomadModal.confirm(
        'Are you sure you want to delete this item? This action cannot be undone.',
        {
          title: 'Confirm Deletion',
          confirmText: 'Delete',
          cancelText: 'Cancel'
        }
      );
      
      if (confirmed) {
        NomadModal.alert('Item deleted successfully!', {
          title: 'Success',
          buttonText: 'OK'
        });
      }
    });

    // Alert dialog
    const alertBtn = document.createElement('button');
    alertBtn.textContent = 'Show Alert';
    alertBtn.style.cssText = 'padding: 0.5rem 1rem; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer;';
    
    alertBtn.addEventListener('click', async () => {
      await NomadModal.alert(
        'This is an important message that requires your attention.',
        {
          title: 'Important Notice',
          buttonText: 'Got it!'
        }
      );
    });

    // Custom confirmation
    const customBtn = document.createElement('button');
    customBtn.textContent = 'Custom Confirm';
    customBtn.style.cssText = 'padding: 0.5rem 1rem; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer;';
    
    customBtn.addEventListener('click', async () => {
      const result = await NomadModal.confirm(
        'Would you like to save your changes before leaving?',
        {
          title: 'Unsaved Changes',
          confirmText: 'Save & Exit',
          cancelText: 'Discard'
        }
      );
      
      const action = result ? 'saved and exited' : 'discarded changes';
      NomadModal.alert(`You ${action}.`);
    });

    container.append(confirmBtn, alertBtn, customBtn);
    return container;
  },
};

export const FormModal: Story = {
  render: () => {
    const container = document.createElement('div');
    
    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open Form Modal';
    openBtn.style.cssText = 'padding: 0.5rem 1rem; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer;';
    
    openBtn.addEventListener('click', () => {
      const modal = document.createElement('nomad-modal');
      modal.setAttribute('title', 'User Information');
      modal.setAttribute('size', 'lg');
      modal.setAttribute('closable', '');
      modal.setAttribute('persistent', '');
      
      modal.innerHTML = `
        <div slot="body">
          <form style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Name:</label>
              <input type="text" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px;" placeholder="Enter your name">
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Email:</label>
              <input type="email" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px;" placeholder="Enter your email">
            </div>
            <div>
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Message:</label>
              <textarea rows="4" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 4px; resize: vertical;" placeholder="Enter your message"></textarea>
            </div>
          </form>
        </div>
        <div slot="footer">
          <button class="cancel-btn" style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; background: white; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">
            Cancel
          </button>
          <button class="submit-btn" style="padding: 0.5rem 1rem; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Submit
          </button>
        </div>
      `;
      
      modal.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('cancel-btn')) {
          (modal as any).close();
        } else if (target.classList.contains('submit-btn')) {
          NomadModal.alert('Form submitted successfully!', {
            title: 'Success'
          }).then(() => {
            (modal as any).close();
          });
        }
      });
      
      wireEvents(modal, 'FormModal');
      document.body.appendChild(modal);
      (modal as any).open();
    });
    
    container.appendChild(openBtn);
    return container;
  },
};

export const ImageGallery: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;';
    
    const images = [
      { src: 'https://picsum.photos/400/300?random=1', title: 'Nature Scene' },
      { src: 'https://picsum.photos/400/300?random=2', title: 'City View' },
      { src: 'https://picsum.photos/400/300?random=3', title: 'Architecture' },
      { src: 'https://picsum.photos/400/300?random=4', title: 'Landscape' },
    ];
    
    images.forEach(({ src, title }) => {
      const imageContainer = document.createElement('div');
      imageContainer.style.cssText = 'cursor: pointer; border-radius: 8px; overflow: hidden; border: 2px solid transparent; transition: all 0.2s;';
      
      imageContainer.innerHTML = `
        <img src="${src}" alt="${title}" style="width: 100%; height: 120px; object-fit: cover; display: block;">
        <div style="padding: 0.5rem; background: #f9fafb; text-align: center; font-size: 0.875rem; color: #374151;">
          ${title}
        </div>
      `;
      
      imageContainer.addEventListener('mouseenter', () => {
        imageContainer.style.borderColor = '#3b82f6';
        imageContainer.style.transform = 'scale(1.02)';
      });
      
      imageContainer.addEventListener('mouseleave', () => {
        imageContainer.style.borderColor = 'transparent';
        imageContainer.style.transform = 'scale(1)';
      });
      
      imageContainer.addEventListener('click', () => {
        NomadModal.show(`
          <div style="text-align: center;">
            <img src="${src}" alt="${title}" style="max-width: 100%; height: auto; border-radius: 4px;">
            <h3 style="margin: 1rem 0 0 0; color: #374151;">${title}</h3>
          </div>
        `, {
          title: 'Image Preview',
          size: 'lg',
          closable: true,
          backdropClose: true
        });
      });
      
      container.appendChild(imageContainer);
    });
    
    return container;
  },
};

export const NestedModals: Story = {
  render: () => {
    const container = document.createElement('div');
    
    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open Parent Modal';
    openBtn.style.cssText = 'padding: 0.5rem 1rem; background: #8b5cf6; color: white; border: none; border-radius: 4px; cursor: pointer;';
    
    openBtn.addEventListener('click', () => {
      const parentModal = document.createElement('nomad-modal');
      parentModal.setAttribute('title', 'Parent Modal');
      parentModal.setAttribute('size', 'md');
      parentModal.setAttribute('closable', '');
      parentModal.setAttribute('backdrop-close', '');
      
      parentModal.innerHTML = `
        <div slot="body">
          <p>This is the parent modal. You can open another modal from here.</p>
          <p>This demonstrates modal stacking and z-index management.</p>
        </div>
        <div slot="footer">
          <button class="open-child-btn" style="padding: 0.5rem 1rem; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">
            Open Child Modal
          </button>
          <button class="close-parent-btn" style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; background: white; border-radius: 4px; cursor: pointer;">
            Close
          </button>
        </div>
      `;
      
      parentModal.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('open-child-btn')) {
          const childModal = document.createElement('nomad-modal');
          childModal.setAttribute('title', 'Child Modal');
          childModal.setAttribute('size', 'sm');
          childModal.setAttribute('closable', '');
          childModal.setAttribute('backdrop-close', '');
          
          childModal.innerHTML = `
            <div slot="body">
              <p>This is a child modal opened from the parent modal.</p>
              <p>Notice how it appears above the parent modal.</p>
            </div>
            <div slot="footer">
              <button class="close-child-btn" style="padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Close Child
              </button>
            </div>
          `;
          
          childModal.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains('close-child-btn')) {
              (childModal as any).close();
            }
          });
          
          document.body.appendChild(childModal);
          (childModal as any).open();
          
        } else if (target.classList.contains('close-parent-btn')) {
          (parentModal as any).close();
        }
      });
      
      wireEvents(parentModal, 'NestedModals');
      document.body.appendChild(parentModal);
      (parentModal as any).open();
    });
    
    container.appendChild(openBtn);
    return container;
  },
};

export const LongContent: Story = {
  render: () => {
    const container = document.createElement('div');
    
    const openBtn = document.createElement('button');
    openBtn.textContent = 'Open Long Content Modal';
    openBtn.style.cssText = 'padding: 0.5rem 1rem; background: #f59e0b; color: white; border: none; border-radius: 4px; cursor: pointer;';
    
    openBtn.addEventListener('click', () => {
      const longContent = Array.from({ length: 50 }, (_, i) => 
        `<p>This is paragraph ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>`
      ).join('');
      
      NomadModal.show(`
        <div style="line-height: 1.6;">
          <h3>Terms and Conditions</h3>
          ${longContent}
          <p><strong>End of document.</strong></p>
        </div>
      `, {
        title: 'Scrollable Content',
        size: 'lg',
        closable: true,
        backdropClose: true
      });
    });
    
    container.appendChild(openBtn);
    return container;
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.cssText = 'display: flex; gap: 1rem; flex-wrap: wrap;';
    
    // Quick actions
    const quickAlert = document.createElement('button');
    quickAlert.textContent = 'Quick Alert';
    quickAlert.style.cssText = 'padding: 0.5rem 1rem; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;';
    quickAlert.addEventListener('click', () => {
      NomadModal.alert('This is a quick alert message!');
    });
    
    // Destructive action
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete Account';
    deleteBtn.style.cssText = 'padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;';
    deleteBtn.addEventListener('click', async () => {
      const confirmed = await NomadModal.confirm(
        'This will permanently delete your account and all associated data. This action cannot be undone.',
        {
          title: 'Delete Account',
          confirmText: 'Delete Forever',
          cancelText: 'Keep Account'
        }
      );
      
      if (confirmed) {
        NomadModal.alert('Account deletion initiated. You will receive a confirmation email.', {
          title: 'Account Deleted'
        });
      }
    });
    
    // Settings modal
    const settingsBtn = document.createElement('button');
    settingsBtn.textContent = 'Open Settings';
    settingsBtn.style.cssText = 'padding: 0.5rem 1rem; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;';
    settingsBtn.addEventListener('click', () => {
      const modal = document.createElement('nomad-modal');
      modal.setAttribute('title', 'Settings');
      modal.setAttribute('size', 'lg');
      modal.setAttribute('closable', '');
      
      modal.innerHTML = `
        <div slot="body">
          <div style="display: grid; gap: 1.5rem;">
            <div>
              <h4 style="margin: 0 0 0.5rem 0; color: #374151;">Account Settings</h4>
              <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="checkbox" checked>
                Email notifications
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="checkbox">
                SMS notifications  
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="checkbox" checked>
                Marketing emails
              </label>
            </div>
            
            <div>
              <h4 style="margin: 0 0 0.5rem 0; color: #374151;">Privacy Settings</h4>
              <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="radio" name="privacy" value="public" checked>
                Public profile
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <input type="radio" name="privacy" value="friends">
                Friends only
              </label>
              <label style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="radio" name="privacy" value="private">
                Private
              </label>
            </div>
          </div>
        </div>
        <div slot="footer">
          <button class="cancel-btn" style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; background: white; border-radius: 4px; cursor: pointer; margin-right: 0.5rem;">
            Cancel
          </button>
          <button class="save-btn" style="padding: 0.5rem 1rem; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Save Settings
          </button>
        </div>
      `;
      
      modal.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('cancel-btn')) {
          (modal as any).close();
        } else if (target.classList.contains('save-btn')) {
          NomadModal.alert('Settings saved successfully!', {
            title: 'Success'
          }).then(() => {
            (modal as any).close();
          });
        }
      });
      
      wireEvents(modal, 'Settings');
      document.body.appendChild(modal);
      (modal as any).open();
    });
    
    // Full screen modal
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.textContent = 'Full Screen Modal';
    fullscreenBtn.style.cssText = 'padding: 0.5rem 1rem; background: #059669; color: white; border: none; border-radius: 4px; cursor: pointer;';
    fullscreenBtn.addEventListener('click', () => {
      NomadModal.show(`
        <div style="padding: 2rem; text-align: center;">
          <h2 style="color: #374151; margin-bottom: 1rem;">Full Screen Experience</h2>
          <p style="font-size: 1.125rem; color: #6b7280; max-width: 600px; margin: 0 auto;">
            This modal takes up most of the screen real estate, perfect for complex interfaces,
            detailed forms, or immersive content experiences.
          </p>
          <div style="margin-top: 2rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px;">
              <h3 style="color: #374151; margin: 0 0 0.5rem 0;">Feature 1</h3>
              <p style="color: #6b7280; margin: 0;">Description of the first feature</p>
            </div>
            <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px;">
              <h3 style="color: #374151; margin: 0 0 0.5rem 0;">Feature 2</h3>
              <p style="color: #6b7280; margin: 0;">Description of the second feature</p>
            </div>
            <div style="background: #f3f4f6; padding: 1.5rem; border-radius: 8px;">
              <h3 style="color: #374151; margin: 0 0 0.5rem 0;">Feature 3</h3>
              <p style="color: #6b7280; margin: 0;">Description of the third feature</p>
            </div>
          </div>
        </div>
      `, {
        title: 'Full Screen Modal',
        size: 'full',
        closable: true,
        backdropClose: false
      });
    });
    
    container.append(quickAlert, deleteBtn, settingsBtn, fullscreenBtn);
    return container;
  },
};