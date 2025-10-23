
interface BaseComponentProps {
  className?: string;
  id?: string;
  style?: string | Partial<CSSStyleDeclaration>;
  ref?: React.Ref<any>;
}

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

export {};