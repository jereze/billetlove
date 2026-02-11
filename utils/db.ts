import Dexie, { type Table } from "dexie";
import type { Attendee, ApiCallLog } from "./types";

/**
 * Base de données IndexedDB pour BilletLove
 * Stocke les grandes collections de données (participants, logs API, ...)
 */
export class BilletLoveDB extends Dexie {
  attendees!: Table<Attendee>;
  apiCallLogs!: Table<ApiCallLog>;

  constructor() {
    super("BilletLoveDB");

    this.version(1).stores({
      // Index sur eventId, email et nom pour recherches rapides
      attendees: "++id, eventId, email, [firstName+lastName]",

      // Index sur timestamp pour tri chronologique et nettoyage des vieux logs
      apiCallLogs: "++id, timestamp, endpoint",
    });

    // Version 2: Structure simplifiée pour attendees
    this.version(2).stores({
      // Index sur event, email et nom pour recherches rapides
      attendees: "id, event, email, [firstName+lastName]",

      // Index sur timestamp pour tri chronologique et nettoyage des vieux logs
      apiCallLogs: "++id, timestamp, endpoint",
    });
  }
}

// Instance singleton de la base de données
export const db = new BilletLoveDB();

/**
 * Helpers pour gérer les logs API avec limite de 1000 entrées
 */
export const apiLogsService = {
  /**
   * Ajoute un log d'appel API et maintient la limite de 1000 entrées
   */
  async addLog(log: Omit<ApiCallLog, "id">): Promise<number> {
    const id = await db.apiCallLogs.add(log as ApiCallLog);

    // Maintenir seulement les 1000 derniers logs
    const count = await db.apiCallLogs.count();
    if (count > 1000) {
      const excess = count - 1000;
      const oldestLogs = await db.apiCallLogs
        .orderBy("timestamp")
        .limit(excess)
        .toArray();

      await db.apiCallLogs.bulkDelete(
        oldestLogs.map((log) => log.id!).filter((id) => id !== undefined)
      );
    }

    return id;
  },

  /**
   * Récupère les N derniers logs
   */
  async getRecentLogs(limit: number = 100): Promise<ApiCallLog[]> {
    return db.apiCallLogs.orderBy("timestamp").reverse().limit(limit).toArray();
  },

  /**
   * Récupère les logs pour un endpoint spécifique
   */
  async getLogsByEndpoint(endpoint: string): Promise<ApiCallLog[]> {
    return db.apiCallLogs
      .where("endpoint")
      .equals(endpoint)
      .reverse()
      .toArray();
  },

  /**
   * Supprime tous les logs
   */
  async clearAll(): Promise<void> {
    await db.apiCallLogs.clear();
  },
};

/**
 * Helpers pour gérer les participants
 */
export const attendeesService = {
  /**
   * Ajoute un participant
   */
  async add(attendee: Attendee): Promise<number> {
    return db.attendees.add(attendee);
  },

  /**
   * Ajoute ou met à jour plusieurs participants en masse
   */
  async bulkPut(attendees: Attendee[]): Promise<number> {
    return db.attendees.bulkPut(attendees);
  },

  /**
   * Récupère tous les participants d'un événement
   */
  async getByEvent(eventId: string): Promise<Attendee[]> {
    return db.attendees.where("event").equals(eventId).toArray();
  },

  /**
   * Recherche un participant par email
   */
  async findByEmail(email: string): Promise<Attendee[]> {
    return db.attendees.where("email").equalsIgnoreCase(email).toArray();
  },

  /**
   * Supprime tous les participants d'un événement
   */
  async deleteByEvent(eventId: string): Promise<number> {
    return db.attendees.where("eventId").equals(eventId).delete();
  },

  /**
   * Supprime tous les participants
   */
  async clearAll(): Promise<void> {
    await db.attendees.clear();
  },

  /**
   * Récupère tous les participants (tous événements confondus)
   */
  async getAll(): Promise<Attendee[]> {
    return db.attendees.toArray();
  },
};
