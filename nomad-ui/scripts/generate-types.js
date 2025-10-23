#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const typesDir = path.join(distDir, 'types');

// Ensure directories exist
if (!fs.existsSync(typesDir)) {
  fs.mkdirSync(typesDir, { recursive: true });
}

console.log('Generating framework-specific type declarations...');

// Base component interface
const baseComponentProps = `
interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: string | Partial<CSSStyleDeclaration>;
  ref?: React.Ref<any>;
}`;

// React-specific types
const reactTypes = `${baseComponentProps}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'nomad-button': BaseComponentProps & {
        variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
        disabled?: boolean;
        loading?: boolean;
        label?: string;
        'data-action'?: string;
        children?: React.ReactNode;
      };

      'nomad-input': BaseComponentProps & {
        type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
        placeholder?: string;
        label?: string;
        value?: string;
        disabled?: boolean;
        required?: boolean;
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
        variant?: 'default' | 'success' | 'error' | 'warning';
        name?: string;
      };

      'nomad-dropdown': BaseComponentProps & {
        label?: string;
        value?: string;
        placeholder?: string;
        disabled?: boolean;
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
        variant?: 'default' | 'success' | 'error' | 'warning';
        options?: string;
        name?: string;
      };

      'nomad-modal': BaseComponentProps & {
        open?: boolean;
        title?: string;
        size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
        closable?: boolean;
        'backdrop-close'?: boolean;
        persistent?: boolean;
        children?: React.ReactNode;
      };

      'nomad-toast': BaseComponentProps & {
        message?: string;
        variant?: 'success' | 'error' | 'warning' | 'info';
        duration?: number | string;
        closable?: boolean;
        position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
        show?: boolean;
      };

      'nomad-navigation': BaseComponentProps & {
        brand?: string;
        variant?: 'light' | 'dark' | 'primary' | 'transparent';
        position?: 'static' | 'fixed' | 'sticky';
        'mobile-breakpoint'?: string;
        'nav-items'?: string;
        children?: React.ReactNode;
      };
    }
  }
}

export {};`;

// Vue-specific types
const vueTypes = `${baseComponentProps}

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    NomadButton: DefineComponent<{
      variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      disabled?: boolean;
      loading?: boolean;
      label?: string;
    }>;

    NomadInput: DefineComponent<{
      type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
      placeholder?: string;
      label?: string;
      value?: string;
      disabled?: boolean;
      required?: boolean;
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      variant?: 'default' | 'success' | 'error' | 'warning';
      name?: string;
    }>;

    NomadDropdown: DefineComponent<{
      label?: string;
      value?: string;
      placeholder?: string;
      disabled?: boolean;
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      variant?: 'default' | 'success' | 'error' | 'warning';
      options?: string;
      name?: string;
    }>;

    NomadModal: DefineComponent<{
      open?: boolean;
      title?: string;
      size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
      closable?: boolean;
      'backdrop-close'?: boolean;
      persistent?: boolean;
    }>;

    NomadToast: DefineComponent<{
      message?: string;
      variant?: 'success' | 'error' | 'warning' | 'info';
      duration?: number | string;
      closable?: boolean;
      position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
      show?: boolean;
    }>;

    NomadNavigation: DefineComponent<{
      brand?: string;
      variant?: 'light' | 'dark' | 'primary' | 'transparent';
      position?: 'static' | 'fixed' | 'sticky';
      'mobile-breakpoint'?: string;
      'nav-items'?: string;
    }>;
  }
}

export {};`;

// Angular-specific types
const angularTypes = `${baseComponentProps}

declare global {
  interface HTMLElementTagNameMap {
    'nomad-button': HTMLElement & {
      variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      disabled: boolean;
      loading: boolean;
      label: string;
    };

    'nomad-input': HTMLElement & {
      type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
      placeholder: string;
      label: string;
      value: string;
      disabled: boolean;
      required: boolean;
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      variant: 'default' | 'success' | 'error' | 'warning';
      name: string;
    };

    'nomad-dropdown': HTMLElement & {
      label: string;
      value: string;
      placeholder: string;
      disabled: boolean;
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
      variant: 'default' | 'success' | 'error' | 'warning';
      options: string;
      name: string;
    };

    'nomad-modal': HTMLElement & {
      open: boolean;
      title: string;
      size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
      closable: boolean;
      persistent: boolean;
    };

    'nomad-toast': HTMLElement & {
      message: string;
      variant: 'success' | 'error' | 'warning' | 'info';
      duration: number;
      closable: boolean;
      position: string;
      show: boolean;
    };

    'nomad-navigation': HTMLElement & {
      brand: string;
      variant: 'light' | 'dark' | 'primary' | 'transparent';
      position: 'static' | 'fixed' | 'sticky';
      'mobile-breakpoint': string;
      'nav-items': string;
    };
  }
}`;

// Universal/Vanilla types
const universalTypes = `${baseComponentProps}

// Universal type declarations for any JavaScript framework
export interface NomadButtonElement extends HTMLElement {
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled: boolean;
  loading: boolean;
  label: string;
}

export interface NomadInputElement extends HTMLElement {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder: string;
  label: string;
  value: string;
  disabled: boolean;
  required: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant: 'default' | 'success' | 'error' | 'warning';
  name: string;
}

export interface NomadDropdownElement extends HTMLElement {
  label: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant: 'default' | 'success' | 'error' | 'warning';
  options: string;
  name: string;
}

export interface NomadModalElement extends HTMLElement {
  open: boolean;
  title: string;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable: boolean;
  persistent: boolean;
  show(): void;
  hide(): void;
}

export interface NomadToastElement extends HTMLElement {
  message: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  closable: boolean;
  position: string;
  show: boolean;
}

export interface NomadNavigationElement extends HTMLElement {
  brand: string;
  variant: 'light' | 'dark' | 'primary' | 'transparent';
  position: 'static' | 'fixed' | 'sticky';
  'mobile-breakpoint': string;
  'nav-items': string;
}

declare global {
  interface HTMLElementTagNameMap {
    'nomad-button': NomadButtonElement;
    'nomad-input': NomadInputElement;
    'nomad-dropdown': NomadDropdownElement;
    'nomad-modal': NomadModalElement;
    'nomad-toast': NomadToastElement;
    'nomad-navigation': NomadNavigationElement;
  }
}`;

// Write framework-specific declaration files
fs.writeFileSync(path.join(typesDir, 'react.d.ts'), reactTypes);
fs.writeFileSync(path.join(typesDir, 'vue.d.ts'), vueTypes);
fs.writeFileSync(path.join(typesDir, 'angular.d.ts'), angularTypes);
fs.writeFileSync(path.join(typesDir, 'universal.d.ts'), universalTypes);

// Create main index.d.ts that exports everything
const mainIndex = `// NomadUI - Framework Agnostic Web Components
export * from './components/Button/NomadButton';
export * from './components/Input/NomadInput';
export * from './components/Dropdown/NomadDropdown';
export * from './components/Modal/NomadModal';
export * from './components/Toast/NomadToast';
export * from './components/Navigation/NomadNavigation';

// Re-export framework-specific types
export * from './universal';

// Auto-include React types for React projects
import './react';
`;

fs.writeFileSync(path.join(typesDir, 'index.d.ts'), mainIndex);

// Create usage documentation
const usageDoc = `# NomadUI Framework Usage

## React
\`\`\`typescript
import 'nomad-ui';
// Types are automatically available

function App() {
  return <nomad-button variant="primary">Click me</nomad-button>;
}
\`\`\`

## Vue
\`\`\`typescript
import 'nomad-ui';
import type {} from 'nomad-ui/dist/types/vue';

// In template:
// <nomad-button variant="primary">Click me</nomad-button>
\`\`\`

## Angular
\`\`\`typescript
import 'nomad-ui';

// Add to app.module.ts:
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

// In template:
// <nomad-button variant="primary">Click me</nomad-button>
\`\`\`

## Vanilla JavaScript
\`\`\`javascript
import 'nomad-ui';

const button = document.createElement('nomad-button');
button.setAttribute('variant', 'primary');
button.textContent = 'Click me';
document.body.appendChild(button);
\`\`\`
`;

fs.writeFileSync(path.join(distDir, 'USAGE.md'), usageDoc);

console.log('✅ Generated framework-specific types:');
console.log('   - dist/types/react.d.ts');
console.log('   - dist/types/vue.d.ts');
console.log('   - dist/types/angular.d.ts');
console.log('   - dist/types/universal.d.ts');
console.log('   - dist/types/index.d.ts');
console.log('   - dist/USAGE.md');