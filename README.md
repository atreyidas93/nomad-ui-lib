# NomadUI 🚀

A modern, framework-agnostic Web Component library built with Vanilla JavaScript. Use NomadUI components seamlessly across all Web Applications with React, Angular, Vue, or any web framework.

## ✨ Features

- **Framework Agnostic**: Works with React, Angular, Vue, and Vanilla JS
- **TypeScript Support**: Full type definitions included
- **Modern Web Standards**: Built with Custom Elements API
- **Lightweight**: No external dependencies
- **Themeable**: CSS custom properties for easy customization
- **Accessible**: WCAG 2.1 AA compliant components
- **Developer Friendly**: Comprehensive Storybook documentation

## 📦 Components

- 🔘 **Button** - Interactive buttons with multiple variants
- 📝 **Input** - Form inputs with validation states
- 📋 **Dropdown** - Customizable dropdown menus
- 🔔 **Notification** - Toast notifications and alerts
- 🧭 **Navigation** - Navigation bars and menus
- 🪟 **Modal** - Dialog and modal overlays
- 📊 **Grid** - Flexible layout grid system

## 🚀 Quick Start

### Installation

```bash
npm install @nomadui/core
```

### Usage

#### Vanilla JavaScript
```html
<script type="module">
  import '@nomadui/core';
</script>

<nomad-button variant="primary">Click me!</nomad-button>
```

#### React
```jsx
import '@nomadui/core';

function App() {
  return <nomad-button variant="primary">Click me!</nomad-button>;
}
```

#### Angular
```typescript
// app.module.ts
import '@nomadui/core';

// component.html
<nomad-button variant="primary">Click me!</nomad-button>
```

#### Vue
```vue
<template>
  <nomad-button variant="primary">Click me!</nomad-button>
</template>

<script>
import '@nomadui/core';
</script>
```

## 🎨 Theming

NomadUI uses CSS custom properties for theming:

```css
:root {
  --nomad-primary: #007bff;
  --nomad-secondary: #6c757d;
  --nomad-success: #28a745;
  --nomad-danger: #dc3545;
  --nomad-warning: #ffc107;
  --nomad-info: #17a2b8;
}
```

## 📚 Documentation

Visit our [Storybook documentation](https://nomad-ui.storybook.com) for:
- Interactive component playground
- API documentation
- Usage examples
- Theming guides

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run Storybook
npm run storybook

# Build library
npm run build

# Run tests
npm test
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

## 📋 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

Private - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](https://your-docs-url.com)
- [Storybook](https://your-storybook-url.com)
- [GitHub](https://github.com/yourusername/nomadui)
- [NPM Package](https://www.npmjs.com/package/@nomadui/core)
