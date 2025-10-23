export class NomadDropdown extends HTMLElement {
  onDropdownChange: ((data: { value: string; oldValue: string; options: string[] }) => void) | null = null;
  onDropdownOpen: (() => void) | null = null;
  onDropdownClose: (() => void) | null = null;

  private isOpen = false;
  private options: string[] = [];
  private _internalValue: string = '';
  private _rendering = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['label', 'value', 'placeholder', 'disabled', 'size', 'variant', 'options'];
  }

  connectedCallback() {
    this._internalValue = this.getAttribute('value') || '';
    this.parseOptions();
    this.render();
    this.attachEvents();
  }

  get label() { return this.getAttribute('label') || ''; }
  get value() { return this._internalValue; }
  get placeholder() { return this.getAttribute('placeholder') || 'Select an option...'; }
  get disabled() { return this.hasAttribute('disabled'); }
  get size() { return this.getAttribute('size') || 'md'; }
  get variant() { return this.getAttribute('variant') || 'default'; }

  set value(val: string) {
    this._internalValue = val;
    this.setAttribute('value', val);
    this.updateSelectedDisplay();
  }

 attributeChangedCallback(name: string, oldValue: string, newValue: string) {
  if (this.shadowRoot && !this._rendering) {
    
    const savedCallbacks = {
      onDropdownChange: this.onDropdownChange,
      onDropdownOpen: this.onDropdownOpen,
      onDropdownClose: this.onDropdownClose
    };
    
    this.render();
    this.attachEvents();
    
    Object.assign(this, savedCallbacks);
  }
}

  parseOptions() {
    const optionsAttr = this.getAttribute('options');
    if (optionsAttr) {
      try {
        this.options = JSON.parse(optionsAttr);
      } catch {
        this.options = optionsAttr.split(',').map(opt => opt.trim());
      }
    } else {
      this.options = Array.from(this.children)
        .filter(child => child.tagName === 'OPTION')
        .map(option => option.textContent || '');
    }
  }

  updateSelectedDisplay() {
    const textEl = this.shadowRoot?.querySelector('.dropdown-text');
    const selectedText = this._internalValue || this.placeholder;
    
    if (textEl) {
      textEl.textContent = selectedText;
      textEl.classList.toggle('placeholder', !this._internalValue);
    }

    this.shadowRoot?.querySelectorAll('.dropdown-option').forEach(option => {
      const el = option as HTMLElement;
      el.classList.toggle('selected', el.dataset.value === this._internalValue);
    });
  }

  updateDropdownList() {
    const list = this.shadowRoot?.querySelector('.dropdown-list');
    if (list) {
      list.innerHTML = this.options.map(option => `
        <div class="dropdown-option ${option === this._internalValue ? 'selected' : ''}" 
             data-value="${option}">
          ${option}
        </div>
      `).join('');
      
      this.attachOptionEvents();
    }
  }

  updateDisabledState() {
    const button = this.shadowRoot?.querySelector('.dropdown-button');
    if (button) {
      if (this.disabled) {
        button.setAttribute('disabled', '');
        button.setAttribute('tabindex', '-1');
      } else {
        button.removeAttribute('disabled');
        button.setAttribute('tabindex', '0');
      }
    }
  }

  render() {
    if (!this.shadowRoot || this._rendering) return;

    this._rendering = true;

    const labelEl = this.label ? `<label class="dropdown-label">${this.label}</label>` : '';
    const selectedText = this._internalValue || this.placeholder;
    
    this.shadowRoot.innerHTML = `
      <style>
.dropdown-container {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: system-ui, sans-serif;
}

.dropdown-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.dropdown-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-family: system-ui, sans-serif;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.dropdown-button:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.dropdown-button:disabled {
  background: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.dropdown-text {
  flex: 1;
  text-align: left;
}

.dropdown-text.placeholder {
  color: #9ca3af;
}

.dropdown-arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #6b7280;
  transition: transform 0.2s;
  margin-left: 0.5rem;
}

.dropdown-button.open .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 4px 4px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  display: none;
}

.dropdown-list.open {
  display: block;
}

.dropdown-option {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-option:hover {
  background-color: #f9fafb;
}

.dropdown-option:last-child {
  border-bottom: none;
}

.dropdown-option.selected {
  background-color: #eff6ff;
  color: #2563eb;
  font-weight: 500;
}

/* Sizes */
.xs { padding: 0.25rem 0.5rem; font-size: 12px; }
.sm { padding: 0.375rem 0.75rem; font-size: 13px; }
.md { padding: 0.5rem 0.75rem; font-size: 14px; }
.lg { padding: 0.75rem 1rem; font-size: 16px; }
.xl { padding: 1rem 1.25rem; font-size: 18px; }

/* Variants */
.default { border-color: #d1d5db; }
.default:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1); }

.success { border-color: #10b981; }
.success:focus { border-color: #059669; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1); }

.error { border-color: #ef4444; }
.error:focus { border-color: #dc2626; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1); }

.warning { border-color: #f59e0b; }
.warning:focus { border-color: #d97706; box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.1); }
      </style>
      <div class="dropdown-container">
        ${labelEl}
        <div class="dropdown-button ${this.size} ${this.variant}" 
             tabindex="${this.disabled ? '-1' : '0'}" 
             ${this.disabled ? 'disabled' : ''}>
          <span class="dropdown-text ${!this._internalValue ? 'placeholder' : ''}">${selectedText}</span>
          <div class="dropdown-arrow"></div>
        </div>
        <div class="dropdown-list">
          ${this.options.map(option => `
            <div class="dropdown-option ${option === this._internalValue ? 'selected' : ''}" 
                 data-value="${option}">
              ${option}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this._rendering = false;
  }

  attachEvents() {
    const button = this.shadowRoot?.querySelector('.dropdown-button');

    if (button && !this.disabled) {
      button.removeEventListener('click', this.handleButtonClick);
      button.removeEventListener('keydown', this.handleKeyDown);

      button.addEventListener('click', this.handleButtonClick);

      button.addEventListener('keydown', this.handleKeyDown);
    }

    this.attachOptionEvents();

    document.removeEventListener('click', this.handleOutsideClick);
    document.addEventListener('click', this.handleOutsideClick);
  }

  attachOptionEvents() {
    const list = this.shadowRoot?.querySelector('.dropdown-list');
    if (list) {
      list.removeEventListener('click', this.handleOptionClick);
      list.addEventListener('click', this.handleOptionClick);
    }
  }

  handleButtonClick = (e: Event) => {
    e.stopPropagation();
    this.toggle();
  };

  handleKeyDown = (e: Event) => {
    const keyEvent = e as KeyboardEvent;
    if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
      keyEvent.preventDefault();
      this.toggle();
    } else if (keyEvent.key === 'Escape') {
      this.close();
    } else if (keyEvent.key === 'ArrowDown') {
      keyEvent.preventDefault();
      this.open();
      this.focusFirstOption();
    }
  };

  handleOptionClick = (e: Event) => {
    const option = (e.target as HTMLElement).closest('.dropdown-option') as HTMLElement;
    if (option) {
      const value = option.dataset.value || '';
      this.selectOption(value);
    }
  };

  handleOutsideClick = () => {
    if (this.isOpen) {
      this.close();
    }
  };

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.disabled) return;
    
    this.isOpen = true;
    const button = this.shadowRoot?.querySelector('.dropdown-button');
    const list = this.shadowRoot?.querySelector('.dropdown-list');
    
    if (button) button.classList.add('open');
    if (list) list.classList.add('open');

    // Call the callback function if provided
    if (typeof this.onDropdownOpen === 'function') {
      this.onDropdownOpen();
    }

    this.dispatchEvent(new CustomEvent('dropdown-open', {
      bubbles: true,
      composed: true
    }));
  }

  close() {
    this.isOpen = false;
    const button = this.shadowRoot?.querySelector('.dropdown-button');
    const list = this.shadowRoot?.querySelector('.dropdown-list');
    
    if (button) button.classList.remove('open');
    if (list) list.classList.remove('open');

    if (typeof this.onDropdownClose === 'function') {
      this.onDropdownClose();
    }

    this.dispatchEvent(new CustomEvent('dropdown-close', {
      bubbles: true,
      composed: true
    }));
  }

  selectOption(value: string) {
    const oldValue = this._internalValue;
    this._internalValue = value;
    
    this.setAttribute('value', value);
    
    this.updateSelectedDisplay();
    this.close();

    const eventData = {
      value: value,
      oldValue: oldValue,
      options: this.options
    };

    if (typeof this.onDropdownChange === 'function') {
      this.onDropdownChange(eventData);
    }

    this.dispatchEvent(new CustomEvent('dropdown-change', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  }

  focusFirstOption() {
    const firstOption = this.shadowRoot?.querySelector('.dropdown-option') as HTMLElement;
    if (firstOption) firstOption.focus();
  }

  // Public methods
  focus() {
    const button = this.shadowRoot?.querySelector('.dropdown-button') as HTMLElement;
    if (button) button.focus();
  }

  blur() {
    const button = this.shadowRoot?.querySelector('.dropdown-button') as HTMLElement;
    if (button) button.blur();
  }

  setOptions(options: string[]) {
    this.options = options;
    this.setAttribute('options', JSON.stringify(options));
    this.updateDropdownList();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick);
  }
}

if (!customElements.get('nomad-dropdown')) {
  customElements.define('nomad-dropdown', NomadDropdown);
}