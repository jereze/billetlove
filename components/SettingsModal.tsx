import { useState, useEffect } from "react";
import {
  Modal,
  TextInput,
  Button,
  Group,
  Stack,
  Text,
  Title,
  Divider,
} from "@mantine/core";
import ColumnSelector from "./ColumnSelector";

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
  currentToken?: string;
  onSave: (token: string) => void;
  onSync: () => Promise<void>;
  isSyncing: boolean;
  availableColumns: string[];
  selectedColumns: string[];
  onColumnsChange: (columns: string[]) => void;
  searchableColumns: string[];
  onSearchableColumnsChange: (columns: string[]) => void;
}

export default function SettingsModal({
  opened,
  onClose,
  currentToken,
  onSave,
  onSync,
  isSyncing,
  availableColumns,
  selectedColumns,
  onColumnsChange,
  searchableColumns,
  onSearchableColumnsChange,
}: SettingsModalProps) {
  const [tokenInput, setTokenInput] = useState(currentToken || "");
  const [error, setError] = useState("");

  // Synchroniser tokenInput avec currentToken
  useEffect(() => {
    setTokenInput(currentToken || "");
  }, [currentToken]);

  const handleSave = async () => {
    if (!tokenInput.trim()) {
      setError("Le token API est requis");
      return;
    }

    onSave(tokenInput.trim());
    setError("");
  };

  const handleSync = async () => {
    if (!tokenInput.trim()) {
      setError("Veuillez enregistrer votre token avant de synchroniser");
      return;
    }
    await onSync();
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Paramètres" size="lg">
      <Stack gap="xl">
        {/* Section Configuration API */}
        <Stack gap="md">
          <Title order={4}>Token API</Title>
          <Text size="sm" c="dimmed">
            Entrez votre token API Billetweb pour pouvoir synchroniser vos
            événements.
          </Text>

          <TextInput
            label="Token API Billetweb"
            placeholder="Basic MjcwMzc4Oj..."
            value={tokenInput}
            onChange={(e) => {
              setTokenInput(e.currentTarget.value);
              setError("");
            }}
            error={error}
          />

          <Button onClick={handleSave} disabled={!tokenInput.trim()} fullWidth>
            Enregistrer le token
          </Button>
        </Stack>

        <Divider />

        {/* Section Synchronisation */}
        <Stack gap="md">
          <Title order={4}>Synchronisation</Title>
          <Text size="sm" c="dimmed">
            Récupérez tous les participants depuis l'API Billetweb. Les données
            seront stockées localement dans l'extension.
          </Text>

          <Button
            onClick={handleSync}
            loading={isSyncing}
            disabled={!tokenInput.trim() || isSyncing}
            variant="filled"
            fullWidth
          >
            {isSyncing
              ? "Synchronisation en cours..."
              : "Synchroniser les participants"}
          </Button>
        </Stack>

        <Divider />

        {/* Section Colonnes d'affichage */}
        <Stack gap="md">
          <Title order={4}>Colonnes d'affichage</Title>
          <Text size="sm" c="dimmed">
            Choisissez les colonnes à afficher dans la table des participants.
            Les colonnes disponibles sont détectées automatiquement lors de la
            synchronisation.
          </Text>

          {availableColumns.length > 0 ? (
            <ColumnSelector
              availableColumns={availableColumns}
              selectedColumns={selectedColumns}
              onChange={onColumnsChange}
            />
          ) : (
            <Text size="sm" c="dimmed" fs="italic">
              Synchronisez vos données pour voir les colonnes disponibles.
            </Text>
          )}
        </Stack>

        <Divider />

        {/* Section Colonnes de recherche */}
        <Stack gap="md">
          <Title order={4}>Colonnes de recherche</Title>
          <Text size="sm" c="dimmed">
            Sélectionnez les colonnes dans lesquelles effectuer la recherche. La
            recherche s'effectue par substring (ex: "dupont" trouve
            "jean.dupont@email.fr").
          </Text>

          {availableColumns.length > 0 ? (
            <ColumnSelector
              availableColumns={availableColumns}
              selectedColumns={searchableColumns}
              onChange={onSearchableColumnsChange}
            />
          ) : (
            <Text size="sm" c="dimmed" fs="italic">
              Synchronisez vos données pour voir les colonnes disponibles.
            </Text>
          )}
        </Stack>

        <Divider />

        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={onClose}>
            Fermer
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
