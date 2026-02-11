import { apiLogsService } from "./db";

/**
 * Service API pour communiquer avec billetweb.fr
 */

const BASE_URL = "https://www.billetweb.fr/api";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Effectue un appel API avec authentification Basic Auth
 */
async function fetchWithAuth<T>(
  endpoint: string,
  apiToken: string,
  method: string = "GET",
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  const startTime = Date.now();

  try {
    // Normaliser le token : accepter "Basic XXX" ou juste "XXX"
    const trimmedToken = apiToken.trim();
    const authHeader = /^basic\s+/i.test(trimmedToken)
      ? trimmedToken.replace(/^basic\s+/i, 'Basic ')
      : `Basic ${trimmedToken}`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const responseBody = await response.json().catch(() => null);

    // Logger l'appel
    await apiLogsService.addLog({
      timestamp: startTime,
      endpoint,
      method,
      status: response.status,
      responseBody,
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erreur HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data: responseBody as T,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";

    // Logger l'erreur
    await apiLogsService.addLog({
      timestamp: startTime,
      endpoint,
      method,
      error: errorMessage,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Structure de réponse de l'API /attendees
 * Basée sur la structure réelle retournée par billetweb.fr
 */
export interface BilletwebAttendee {
  // Participant
  id: string;
  ext_id: string;
  firstname: string;
  name: string;
  email: string;
  barcode: string;
  used: string;
  lane: string;
  used_date: string;

  // Billet
  ticket: string;
  ticket_id: string;
  category: string;
  price: string;
  seating_location: string;
  reduction_code: string;
  authorization_code: string;
  pass: string;
  disabled: string;
  last_update: string;

  // Événement
  event: string;
  event_name: string;
  event_start: string;
  event_tags: string;

  // Commande
  order_id: string;
  order_ext_id: string;
  order_firstname: string;
  order_name: string;
  order_email: string;
  order_date: string;
  order_paid: string;
  order_payment_type: string;
  order_payment_date: string;
  order_origin: string;
  order_price: string;
  order_session: string;
  order_accreditation: string;
  order_language: string;

  // Session
  session_start: string;

  // URLs
  product_management: string;
  product_download: string;
  order_management: string;

  // Champs personnalisés
  custom?: Record<string, any>;

  // Pour capturer tous les champs non prévus
  [key: string]: any;
}

/**
 * Récupère tous les participants depuis l'API billetweb
 */
export async function fetchAttendees(
  apiToken: string,
): Promise<ApiResponse<BilletwebAttendee[]>> {
  return fetchWithAuth<BilletwebAttendee[]>("/attendees", apiToken);
}

/**
 * Service API billetweb
 */
export const billetwebApi = {
  fetchAttendees,
};
