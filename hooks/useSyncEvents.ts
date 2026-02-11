import { useState } from 'react';
import { storage } from '@/utils/storage';
import type { Attendee } from '@/utils/types';
import { billetwebApi, type BilletwebAttendee } from '@/utils/billetweb-api';
import { flattenObject } from '@/utils/flatten';

export function useSyncEvents() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Convertit un participant de l'API billetweb vers notre format interne
   */
  const mapAttendeeFromApi = (apiAttendee: BilletwebAttendee): Attendee => {
    return {
      id: Number(apiAttendee.id),
      firstName: apiAttendee.firstname || '',
      lastName: apiAttendee.name || '',
      email: apiAttendee.email || '',
      event: String(apiAttendee.event || ''),
      raw: apiAttendee, // Toutes les données brutes en JSON
    };
  };

  const sync = async (apiToken?: string) => {
    if (!apiToken) {
      setError('Token API manquant');
      return;
    }

    setIsSyncing(true);
    setError(null);

    try {
      // Appel API réel
      const response = await billetwebApi.fetchAttendees(apiToken);

      if (!response.success || !response.data) {
        setError(response.error || 'Erreur lors de la récupération des données');
        return;
      }

      // Convertir les données de l'API vers notre format
      const attendees = response.data.map(mapAttendeeFromApi);

      // Utiliser bulkPut pour un upsert (insert or update)
      // Grâce à l'ID de l'API comme clé primaire, cela met à jour les existants
      await storage.attendees.bulkPut(attendees);

      // Extraire toutes les colonnes disponibles depuis les données
      const allColumns = new Set<string>();
      for (const attendee of attendees) {
        const flattened = flattenObject(attendee.raw);
        for (const { key } of flattened) {
          allColumns.add(key);
        }
      }

      // Stocker les colonnes disponibles dans la config
      const availableColumns = Array.from(allColumns).sort();
      await storage.config.update({ availableColumns });

      // Si aucune colonne n'est sélectionnée, définir les colonnes par défaut
      const currentConfig = await storage.config.get();
      if (!currentConfig.selectedColumns || currentConfig.selectedColumns.length === 0) {
        await storage.config.update({
          selectedColumns: ['firstname', 'name', 'email', 'event_name'],
        });
      }

      // Si aucune colonne de recherche n'est sélectionnée, définir les colonnes par défaut
      if (!currentConfig.searchableColumns || currentConfig.searchableColumns.length === 0) {
        await storage.config.update({
          searchableColumns: ['email', 'firstname', 'name'],
        });
      }

      console.log(`✓ ${attendees.length} participant(s) synchronisé(s)`);

    } catch (err) {
      setError('Erreur lors de la synchronisation');
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  return { sync, isSyncing, error };
}
