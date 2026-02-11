import { Button } from '@mantine/core';

interface SyncButtonProps {
  onSync: () => Promise<void>;
  disabled?: boolean;
  loading?: boolean;
}

export default function SyncButton({ onSync, disabled, loading }: SyncButtonProps) {
  return (
    <Button
      onClick={onSync}
      loading={loading}
      disabled={disabled || loading}
      fullWidth
    >
      {loading ? 'Synchronisation en cours...' : 'Synchroniser'}
    </Button>
  );
}
