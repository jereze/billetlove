import { useState, useEffect, useMemo } from 'react';
import { storage } from '@/utils/storage';
import type { Attendee } from '@/utils/types';
import { flattenObject } from '@/utils/flatten';

export function useSearch(attendees: Attendee[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchableColumns, setSearchableColumns] = useState<string[]>([
    'email',
    'firstname',
    'name',
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSearchableColumns();
  }, []);

  const loadSearchableColumns = async () => {
    setIsLoading(true);
    const config = await storage.config.get();

    if (config.searchableColumns && config.searchableColumns.length > 0) {
      setSearchableColumns(config.searchableColumns);
    }

    setIsLoading(false);
  };

  const updateSearchableColumns = async (columns: string[]) => {
    setSearchableColumns(columns);
    await storage.config.update({ searchableColumns: columns });
  };

  // Filtrer les attendees basé sur la recherche
  const filteredAttendees = useMemo(() => {
    if (!searchQuery.trim()) {
      return attendees;
    }

    const query = searchQuery.toLowerCase();

    return attendees.filter((attendee) => {
      // Aplatir les données
      const flatData = flattenObject(attendee.raw);
      const dataMap = new Map(flatData.map(({ key, value }) => [key, value]));

      // Chercher dans les colonnes searchables
      return searchableColumns.some((column) => {
        const value = dataMap.get(column);
        return value && value.toLowerCase().includes(query);
      });
    });
  }, [attendees, searchQuery, searchableColumns]);

  return {
    searchQuery,
    setSearchQuery,
    searchableColumns,
    updateSearchableColumns,
    filteredAttendees,
    isLoading,
    refresh: loadSearchableColumns,
  };
}
