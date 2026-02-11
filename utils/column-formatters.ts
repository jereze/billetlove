/**
 * Mappings de valeurs pour certaines colonnes
 * Permet de transformer les codes en textes lisibles
 */

type ValueMapping = Record<string, string>;

/**
 * Mappings de valeurs pour chaque colonne
 */
const COLUMN_VALUE_MAPPINGS: Record<string, ValueMapping> = {
  order_paid: {
    "0": "Non payé",
    "1": "Payé",
  },

  order_accreditation: {
    "0": "Non applicable",
    "1": "En attente",
    "2": "Refusé",
    "3": "Accepté",
  },

  used: {
    "0": "non composté",
    "1": "Composté",
    "2": "Sorti",
  },
};

/**
 * Formate une valeur de cellule en fonction de la colonne
 * Applique les transformations définies dans COLUMN_VALUE_MAPPINGS
 *
 * @param columnKey - La clé de la colonne (ex: "order_paid")
 * @param value - La valeur brute (ex: "1")
 * @returns La valeur formatée (ex: "Payé") ou la valeur originale si pas de mapping
 *
 * @example
 * ```ts
 * formatCellValue('order_paid', '1'); // "Payé"
 * formatCellValue('order_paid', '0'); // "Non payé"
 * formatCellValue('email', 'test@example.com'); // "test@example.com" (pas de transformation)
 * ```
 */
export function formatCellValue(columnKey: string, value: string): string {
  const mapping = COLUMN_VALUE_MAPPINGS[columnKey];

  if (mapping && value in mapping) {
    return mapping[value];
  }

  return value;
}

/**
 * Permet d'ajouter ou modifier des mappings de valeurs
 * Utile pour étendre le système avec de nouveaux mappings
 *
 * @param columnKey - La clé de la colonne
 * @param mapping - Le mapping de valeurs à ajouter/fusionner
 *
 * @example
 * ```ts
 * addValueMapping('custom_status', {
 *   '0': 'Inactif',
 *   '1': 'Actif'
 * });
 * ```
 */
export function addValueMapping(
  columnKey: string,
  mapping: ValueMapping,
): void {
  if (COLUMN_VALUE_MAPPINGS[columnKey]) {
    COLUMN_VALUE_MAPPINGS[columnKey] = {
      ...COLUMN_VALUE_MAPPINGS[columnKey],
      ...mapping,
    };
  } else {
    COLUMN_VALUE_MAPPINGS[columnKey] = mapping;
  }
}

/**
 * Récupère tous les mappings de valeurs actuellement configurés
 * Utile pour l'affichage dans les paramètres
 */
export function getAllValueMappings(): Record<string, ValueMapping> {
  return { ...COLUMN_VALUE_MAPPINGS };
}
