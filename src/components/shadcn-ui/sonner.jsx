import { Toaster as Sonner } from 'sonner';

function Toaster(props) {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'rounded-lg border border-border bg-card text-card-foreground shadow-lg',
          title: 'text-sm font-semibold',
          description: 'text-sm text-muted-foreground',
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
