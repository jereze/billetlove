/**
 * Module principal de stockage pour BilletLove
 *
 * Utilise une approche hybride:
 * - chrome.storage.local pour la configuration utilisateur (tokens, préférences)
 * - IndexedDB (via Dexie) pour les grandes collections (participants, logs API)
 *
 * @example
 * ```typescript
 * import { storage } from '@/utils/storage';
 *
 * // Configuration utilisateur
 * await storage.config.setApiToken('mon-token');
 * const token = await storage.config.getApiToken();
 *
 * // Logs API
 * await storage.apiLogs.add({
 *   timestamp: Date.now(),
 *   endpoint: '/api/events',
 *   method: 'GET',
 *   status: 200
 * });
 *
 * // Participants
 * await storage.attendees.bulkAdd(attendeesList);
 * const eventAttendees = await storage.attendees.getByEvent('event-123');
 * ```
 */

export { configStorage as config } from './config-storage';
export { attendeesService as attendees, apiLogsService as apiLogs, db } from './db';
export type { UserConfig, Attendee, ApiCallLog } from './types';

// Export par défaut pour un import simple
export const storage = {
  config: configStorage,
  attendees: attendeesService,
  apiLogs: apiLogsService,
  db
};

// Ré-exports pour compatibilité
import { configStorage } from './config-storage';
import { attendeesService, apiLogsService, db } from './db';
