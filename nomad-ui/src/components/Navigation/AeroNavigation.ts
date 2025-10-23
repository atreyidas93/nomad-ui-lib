export class NomadNavigation extends HTMLElement {
  onNavClick: ((data: { href: string; text: string; element: HTMLElement }) => void) | null = null;
  onMenuOpen: (() => void) | null = null;
  onMenuClose: (() => void) | null = null;

  private isMobileOpen = false;
  private _rendering = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['brand', 'variant', 'position', 'mobile-breakpoint', 'nav-items'];
  }

  connectedCallback() {
    this.parseNavItems();
    this.render();
    this.attachEvents();
  }

  get brand() { return this.getAttribute('brand') || ''; }
  get variant() { return this.getAttribute('variant') || 'light'; }
  get position() { return this.getAttribute('position') || 'static'; }
  get mobileBreakpoint() { return this.getAttribute('mobile-breakpoint') || '768px'; }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (this.shadowRoot && !this._rendering) {
      if (name === 'brand') {
        this.updateBrand();
        return;
      }

      if (name === 'variant') {
        this.updateVariant();
        return;
      }

      if (name === 'nav-items') {
        this.parseNavItems();
        this.updateNavItems();
        return;
      }

      this.render();
      this.attachEvents();
    }
  }

  parseNavItems() {
    const navItems = this.getAttribute('nav-items');
    if (navItems) {
      try {
        return JSON.parse(navItems);
      } catch {
        return [];
      }
    }
    return [];
  }

  updateBrand() {
    const brandLink = this.shadowRoot?.querySelector('.brand-link');
    if (brandLink) {
      brandLink.textContent = this.brand;
    }

    const brandElement = this.shadowRoot?.querySelector('.nav-brand') as HTMLElement;
    if (brandElement) {
      brandElement.style.display = 'none';
    }
  }

  updateVariant() {
    const navContainer = this.shadowRoot?.querySelector('.nav-container');
    if (navContainer) {
      navContainer.className = navContainer.className.replace(/\bnav--\w+\b/g, '');
      navContainer.classList.add(`nav--${this.variant}`);
    }
  }

  updateNavItems() {
    const navItems = this.parseNavItems();
    const navMenu = this.shadowRoot?.querySelector('.nav-menu');
    
    if (navMenu && navItems.length > 0) {
      const navItemsHtml = navItems.map((item: any) => `
        <li class="nav-item">
          <a href="${item.href || '#'}" class="nav-link ${item.active ? 'active' : ''}" ${item.target ? `target="${item.target}"` : ''}>
            ${item.label}
          </a>
        </li>
      `).join('');
      
      navMenu.innerHTML = navItemsHtml;
      this.attachNavLinkEvents();
    }
  }

  render() {
    if (!this.shadowRoot || this._rendering) return;

    this._rendering = true;

    const navItems = this.parseNavItems();
    const brandElement = this.brand ? `
      <div class="nav-brand">
        <a href="#" class="brand-link">${this.brand}</a>
      </div>
    ` : '';

    const navItemsHtml = navItems.map((item: any) => `
      <li class="nav-item">
        <a href="${item.href || '#'}" class="nav-link ${item.active ? 'active' : ''}" ${item.target ? `target="${item.target}"` : ''}>
          ${item.label}
        </a>
      </li>
    `).join('');

    const mobileToggle = `
      <button class="mobile-toggle" aria-label="Toggle navigation" aria-expanded="${this.isMobileOpen}">
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
        <span class="toggle-bar"></span>
      </button>
    `;

    this.shadowRoot.innerHTML = `
      <style>
:host {
  display: block;
  font-family: system-ui, sans-serif;
  
  /* CSS Custom Properties - Inherit from parent */
  --nav-bg: var(--navigation-bg, transparent);
  --nav-text: var(--navigation-text, currentColor);
  --nav-text-hover: var(--navigation-text-hover, currentColor);
  --nav-border: var(--navigation-border, rgba(0, 0, 0, 0.1));
  --nav-shadow: var(--navigation-shadow, 0 1px 3px rgba(0, 0, 0, 0.1));
  --nav-active-color: var(--navigation-active, currentColor);
}

:host([position="fixed"]) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

:host([position="sticky"]) {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  padding: 0 1rem;
  background-color: var(--nav-bg);
  color: var(--nav-text);
  box-shadow: var(--nav-shadow);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand {
  flex-shrink: 0;
}

.brand-link {
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--nav-text);
  transition: color 0.2s ease;
}

.brand-link:hover {
  color: var(--nav-text-hover);
  opacity: 0.8;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: block;
  padding: 0.5rem 0;
  text-decoration: none;
  color: var(--nav-text);
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: var(--nav-text-hover);
  opacity: 0.8;
}

.nav-link.active {
  border-bottom-color: var(--nav-active-color);
  color: var(--nav-active-color);
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 3px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  width: 2rem;
  height: 2rem;
  color: var(--nav-text);
}

.toggle-bar {
  width: 100%;
  height: 3px;
  background-color: currentColor;
  transition: all 0.3s ease;
  border-radius: 2px;
}

/* Mobile toggle animations */
.mobile-toggle.open .toggle-bar:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-toggle.open .toggle-bar:nth-child(2) {
  opacity: 0;
}

.mobile-toggle.open .toggle-bar:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Variants - Set CSS custom properties */
.nav--transparent {
  --nav-bg: transparent;
  --nav-text: currentColor;
  --nav-border: transparent;
  --nav-shadow: none;
}

.nav--light {
  --nav-bg: #ffffff;
  --nav-text: #374151;
  --nav-text-hover: #1f2937;
  --nav-border: #e5e7eb;
  --nav-active-color: #3b82f6;
  border-bottom: 1px solid var(--nav-border);
}

.nav--dark {
  --nav-bg: #1f2937;
  --nav-text: #ffffff;
  --nav-text-hover: #f3f4f6;
  --nav-border: #374151;
  --nav-active-color: #60a5fa;
  border-bottom: 1px solid var(--nav-border);
}

.nav--primary {
  --nav-bg: #3b82f6;
  --nav-text: #ffffff;
  --nav-text-hover: #f1f5f9;
  --nav-active-color: #fbbf24;
}

/* Inherit parent colors when transparent or no variant */
.nav--inherit,
.nav--transparent {
  --nav-bg: transparent;
  --nav-text: inherit;
  --nav-text-hover: inherit;
  --nav-active-color: inherit;
  --nav-border: transparent;
  --nav-shadow: none;
}

/* Mobile styles */
@media (max-width: ${this.mobileBreakpoint}) {
  .mobile-toggle {
    display: flex;
  }

  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    padding: 1rem 0;
    background-color: var(--nav-bg);
    border-top: 1px solid var(--nav-border);
    box-shadow: var(--nav-shadow);
    display: none;
  }

  .nav-menu.open {
    display: flex;
  }

  .nav-item {
    width: 100%;
    text-align: center;
  }

  .nav-link {
    padding: 0.75rem 1rem;
    border-bottom: none;
    border-left: 2px solid transparent;
  }

  .nav-link.active {
    border-left-color: var(--nav-active-color);
    background-color: rgba(255, 255, 255, 0.05);
  }

  .nav--light .nav-link.active {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

/* Slot content for custom nav items */
::slotted(*) {
  display: none;
  color: var(--nav-text);
}

@media (min-width: ${this.mobileBreakpoint}) {
  .custom-nav-items {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  ::slotted(*) {
    display: flex;
    align-items: center;
    gap: 2rem;
    color: var(--nav-text);
  }
}

@media (max-width: ${this.mobileBreakpoint}) {
  .custom-nav-items {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    padding: 1rem 0;
    background-color: var(--nav-bg);
    border-top: 1px solid var(--nav-border);
    box-shadow: var(--nav-shadow);
    display: none;
  }
  
  .custom-nav-items.open {
    display: flex;
  }
  
  ::slotted(*) {
    flex-direction: column;
    gap: 0;
    width: 100%;
    color: var(--nav-text);
  }
}
      </style>
      <nav class="nav-container nav--${this.variant}">
        <div class="nav">
          ${brandElement}
          
          <div class="nav-content">
            ${navItems.length > 0 ? `
              <ul class="nav-menu ${this.isMobileOpen ? 'open' : ''}">
                ${navItemsHtml}
              </ul>
            ` : `
              <div class="custom-nav-items ${this.isMobileOpen ? 'open' : ''}">
                <slot></slot>
              </div>
            `}
            
            ${mobileToggle}
          </div>
        </div>
      </nav>
    `;

    this._rendering = false;
  }

  attachEvents() {
    const toggle = this.shadowRoot?.querySelector('.mobile-toggle');
    
    toggle?.removeEventListener('click', this.handleToggleClick);
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeyDown);
    
    if (toggle) {
      toggle.addEventListener('click', this.handleToggleClick);
    }

    this.attachNavLinkEvents();

    document.addEventListener('click', this.handleOutsideClick);

    document.addEventListener('keydown', this.handleKeyDown);
  }

  attachNavLinkEvents() {
    const navLinks = this.shadowRoot?.querySelectorAll('.nav-link');
    navLinks?.forEach(link => {
      link.removeEventListener('click', this.handleNavLinkClick);
      link.addEventListener('click', this.handleNavLinkClick);
    });
  }

  handleToggleClick = () => {
    this.toggleMobileMenu();
  };

  handleNavLinkClick = (e: Event) => {
    const link = e.target as HTMLAnchorElement;
    const href = link.getAttribute('href');
    
    if (this.isMobileOpen) {
      this.closeMobileMenu();
    }

    const eventData = {
      href: href || '#',
      text: link.textContent || '',
      element: link
    };

    if (typeof this.onNavClick === 'function') {
      this.onNavClick(eventData);
    }

    this.dispatchEvent(new CustomEvent('nav-click', {
      detail: eventData,
      bubbles: true,
      composed: true
    }));
  };

  handleOutsideClick = (e: Event) => {
    if (this.isMobileOpen && !this.contains(e.target as Node)) {
      this.closeMobileMenu();
    }
  };

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.isMobileOpen) {
      this.closeMobileMenu();
    }
  };

  toggleMobileMenu() {
    if (this.isMobileOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.isMobileOpen = true;
    const toggle = this.shadowRoot?.querySelector('.mobile-toggle');
    const menu = this.shadowRoot?.querySelector('.nav-menu, .custom-nav-items');
    
    if (toggle) toggle.classList.add('open');
    if (menu) menu.classList.add('open');
    
    if (toggle) toggle.setAttribute('aria-expanded', 'true');

    if (typeof this.onMenuOpen === 'function') {
      this.onMenuOpen();
    }

    this.dispatchEvent(new CustomEvent('nav-menu-open', {
      bubbles: true,
      composed: true
    }));
  }

  closeMobileMenu() {
    this.isMobileOpen = false;
    const toggle = this.shadowRoot?.querySelector('.mobile-toggle');
    const menu = this.shadowRoot?.querySelector('.nav-menu, .custom-nav-items');
    
    if (toggle) toggle.classList.remove('open');
    if (menu) menu.classList.remove('open');
    
    if (toggle) toggle.setAttribute('aria-expanded', 'false');

    if (typeof this.onMenuClose === 'function') {
      this.onMenuClose();
    }

    this.dispatchEvent(new CustomEvent('nav-menu-close', {
      bubbles: true,
      composed: true
    }));
  }

  setActiveItem(href: string) {
    const links = this.shadowRoot?.querySelectorAll('.nav-link');
    links?.forEach(link => {
      const linkElement = link as HTMLAnchorElement;
      if (linkElement.getAttribute('href') === href) {
        linkElement.classList.add('active');
      } else {
        linkElement.classList.remove('active');
      }
    });
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeyDown);
  }
}

if (!customElements.get('nomad-navigation')) {
  customElements.define('nomad-navigation', NomadNavigation);
}