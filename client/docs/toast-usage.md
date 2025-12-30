# Toast Utility Usage Guide

## Import
```typescript
import { toast } from '@/shared/utils/toast';
```

## Basic Usage

### Success Toast
```typescript
toast.success('Operation completed successfully!');
toast.success('Saved!', { duration: 5000 });
```

### Error Toast
```typescript
toast.error('Oops, there was an error processing your request.');
toast.error('Failed to save', { 
  description: 'Please check your network connection' 
});
```

### Warning Toast
```typescript
toast.warning('Warning: Please check the entered data.');
```

### Info Toast
```typescript
toast.info('This is for your information, please note.');
```

### Loading Toast
```typescript
const loadingId = toast.loading('Loading data...');
// Later dismiss it
toast.dismiss(loadingId);
```

## Advanced Usage

### Promise-based Toast
```typescript
toast.promise(
  fetchData(),
  {
    loading: 'Loading...',
    success: (data) => `Loaded ${data.length} items`,
    error: 'Failed to load data',
  }
);
```

### Custom Options
All Sonner options are supported:
```typescript
toast.success('Saved!', {
  duration: 5000,
  position: 'top-right',
  description: 'Your changes have been saved',
  action: {
    label: 'Undo',
    onClick: () => console.log('Undo'),
  },
});
```

### Custom Styling Override
```typescript
toast.success('Custom', {
  style: {
    background: 'linear-gradient(to right, #00b09b, #96c93d)',
  }
});
```

## Styling

The toast utility automatically applies custom styling based on the variant:

- **Success**: Green color scheme
- **Error**: Destructive/red color scheme  
- **Warning**: Amber color scheme
- **Info**: Sky blue color scheme

All variants support both light and dark modes automatically.

## TypeScript Support

Full TypeScript support with proper types:
```typescript
import { toast, type ToastOptions, type ToastVariant } from '@/shared/utils/toast';

const options: ToastOptions = {
  duration: 3000,
  position: 'bottom-center',
};

toast.success('Done!', options);
```

## Migration Notes

All existing files using `toast.promise` will continue to work without any code changes, only the import statement needs to be updated:

```diff
- import { toast } from 'sonner';
+ import { toast } from '@/shared/utils/toast';
```
