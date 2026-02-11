/**
 * Types pour le stockage des données BilletLove
 */

// Configuration utilisateur stockée dans chrome.storage
export interface UserConfig {
  apiToken?: string;
  selectedColumns?: string[]; // Colonnes sélectionnées pour l'affichage
  availableColumns?: string[]; // Toutes les colonnes disponibles (détectées au sync)
  searchableColumns?: string[]; // Colonnes utilisées pour la recherche
  // Ajoutez d'autres paramètres utilisateur ici
}

// Participant à un événement
export interface Attendee {
  id: number; // ID de l'API billetweb
  firstName: string;
  lastName: string;
  email: string;
  event: string;
  raw: any; // Toutes les données brutes de l'API en JSON
}

// Log d'appel API pour le débogage
export interface ApiCallLog {
  id?: number; // Auto-incrémenté par Dexie
  timestamp: number;
  endpoint: string;
  method: string;
  status?: number;
  requestBody?: any;
  responseBody?: any;
  error?: string;
}
