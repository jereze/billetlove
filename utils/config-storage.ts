import browser from "webextension-polyfill";
import type { UserConfig } from "./types";

/**
 * Service de stockage pour la configuration utilisateur
 * Utilise browser.storage.local pour les paramètres sensibles et la configuration
 */
const STORAGE_KEY = "billetlove_config";

// Fonction helper pour obtenir l'API storage
function getStorage() {
  if (typeof browser !== "undefined" && browser?.storage?.local) {
    return browser.storage.local;
  }
  // Fallback sur chrome si browser n'est pas disponible
  const chromeGlobal = (globalThis as any).chrome;
  if (typeof chromeGlobal !== "undefined" && chromeGlobal?.storage?.local) {
    return chromeGlobal.storage.local;
  }
  throw new Error(
    "Storage API not available. Make sure the extension is loaded properly."
  );
}

export const configStorage = {
  /**
   * Récupère la configuration complète de l'utilisateur
   */
  async get(): Promise<UserConfig> {
    try {
      const storage = getStorage();
      const result = await storage.get(STORAGE_KEY);
      return result[STORAGE_KEY] || {};
    } catch (error) {
      console.error("Error getting config:", error);
      return {};
    }
  },

  /**
   * Met à jour la configuration (fusion avec l'existant)
   */
  async update(config: Partial<UserConfig>): Promise<void> {
    try {
      const storage = getStorage();
      const current = await this.get();
      await storage.set({
        [STORAGE_KEY]: { ...current, ...config },
      });
    } catch (error) {
      console.error("Error updating config:", error);
    }
  },

  /**
   * Récupère le token API
   */
  async getApiToken(): Promise<string | undefined> {
    const config = await this.get();
    return config.apiToken;
  },

  /**
   * Définit le token API
   */
  async setApiToken(token: string): Promise<void> {
    await this.update({ apiToken: token });
  },

  /**
   * Supprime le token API
   */
  async clearApiToken(): Promise<void> {
    await this.update({ apiToken: undefined });
  },

  /**
   * Réinitialise toute la configuration
   */
  async clear(): Promise<void> {
    try {
      const storage = getStorage();
      await storage.remove(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing config:", error);
    }
  },

  /**
   * Écoute les changements de configuration
   */
  onChange(
    callback: (newConfig: UserConfig, oldConfig: UserConfig) => void
  ): void {
    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === "local" && changes[STORAGE_KEY]) {
        const oldConfig = changes[STORAGE_KEY].oldValue || {};
        const newConfig = changes[STORAGE_KEY].newValue || {};
        callback(newConfig, oldConfig);
      }
    });
  },
};
