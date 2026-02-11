import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';

export function useColumns() {
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'firstname',
    'name',
    'email',
    'event_name',
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadColumns();
  }, []);

  const loadColumns = async () => {
    setIsLoading(true);
    const config = await storage.config.get();

    if (config.availableColumns) {
      setAvailableColumns(config.availableColumns);
    }

    if (config.selectedColumns) {
      setSelectedColumns(config.selectedColumns);
    }

    setIsLoading(false);
  };

  const updateSelectedColumns = async (columns: string[]) => {
    setSelectedColumns(columns);
    await storage.config.update({ selectedColumns: columns });
  };

  return {
    availableColumns,
    selectedColumns,
    isLoading,
    updateSelectedColumns,
    refresh: loadColumns,
  };
}
