/**
 * Représente une entrée aplatie avec clé et valeur
 */
export interface FlattenedEntry {
  key: string;
  value: string;
}

/**
 * Aplatit un objet en un tableau de paires clé-valeur
 * Les sous-objets sont aplatis avec leurs clés séparées par un point
 *
 * @param obj - L'objet à aplatir
 * @param parentKey - Clé parente pour la récursion (usage interne)
 * @returns Tableau de paires clé-valeur aplaties
 *
 * @example
 * ```ts
 * const data = {
 *   name: "John",
 *   custom: {
 *     phone: "0123456789",
 *     pseudo: "john_doe"
 *   }
 * };
 *
 * flattenObject(data);
 * // Retourne:
 * // [
 * //   { key: "name", value: "John" },
 * //   { key: "custom.phone", value: "0123456789" },
 * //   { key: "custom.pseudo", value: "john_doe" }
 * // ]
 * ```
 */
export function flattenObject(
  obj: Record<string, any>,
  parentKey: string = ''
): FlattenedEntry[] {
  const result: FlattenedEntry[] = [];

  for (const [key, value] of Object.entries(obj)) {
    // Construire la clé complète
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    // Si c'est un objet (et pas null ou array), le flatten récursivement
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result.push(...flattenObject(value, fullKey));
    } else {
      // Valeur simple
      result.push({
        key: fullKey,
        value: String(value ?? ''),
      });
    }
  }

  return result;
}

/**
 * Formate une clé technique pour l'affichage UI
 * Enlève le préfixe "custom." pour une meilleure lisibilité
 *
 * @param key - La clé technique (ex: "custom.Téléphone")
 * @returns La clé formatée pour l'affichage (ex: "Téléphone")
 *
 * @example
 * ```ts
 * formatKeyForDisplay("custom.phone"); // "phone"
 * formatKeyForDisplay("event_name"); // "event_name"
 * ```
 */
export function formatKeyForDisplay(key: string): string {
  return key.replace(/^custom\./, '');
}
