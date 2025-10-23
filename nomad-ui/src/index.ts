import './components/Button/NomadButton';
import './components/Input/NomadInput';
import './components/Dropdown/NomadDropdown';
import './components/Modal/NomadModal';
import './components/Toast/NomadToast';
import './components/Navigation/NomadNavigation';

// Export component classes for programmatic access
export { NomadButton } from './components/Button/NomadButton';
export { NomadInput } from './components/Input/NomadInput';
export { NomadDropdown } from './components/Dropdown/NomadDropdown';
export { NomadModal } from './components/Modal/NomadModal';
export { NomadToast } from './components/Toast/NomadToast';
export { NomadNavigation } from './components/Navigation/NomadNavigation';

// Version info
export const version = '1.0.0';

// Helper function to check if all components are registered
export function checkComponentsRegistered(): boolean {
  const components = [
    'nomad-button',
    'nomad-input',
    'nomad-dropdown',
    'nomad-modal',
    'nomad-toast',
    'nomad-navigation'
  ];
  
  return components.every(name => customElements.get(name));
}

// Log successful registration
if (typeof window !== 'undefined') {
  console.log('NomadUI components loaded successfully');
  
  // Optional: Log which components are available
  if (process.env.NODE_ENV === 'development') {
    const registered = [
      'nomad-button',
      'nomad-input', 
      'nomad-dropdown',
      'nomad-modal',
      'nomad-toast',
      'nomad-navigation'
    ].filter(name => customElements.get(name));
    
    console.log('Registered components:', registered);
  }
}