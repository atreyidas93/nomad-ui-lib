# NomadUI Framework Usage

## React
```typescript
import 'nomad-ui';
// Types are automatically available

function App() {
  return <nomad-button variant="primary">Click me</nomad-button>;
}
```

## Vue
```typescript
import 'nomad-ui';
import type {} from 'nomad-ui/dist/types/vue';

// In template:
// <nomad-button variant="primary">Click me</nomad-button>
```

## Angular
```typescript
import 'nomad-ui';

// Add to app.module.ts:
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

// In template:
// <nomad-button variant="primary">Click me</nomad-button>
```

## Vanilla JavaScript
```javascript
import 'nomad-ui';

const button = document.createElement('nomad-button');
button.setAttribute('variant', 'primary');
button.textContent = 'Click me';
document.body.appendChild(button);
```
