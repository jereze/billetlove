import { useState, useEffect } from "react";
import {
  Container,
  Stack,
  Group,
  Title,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import SettingsModal from "@/components/SettingsModal";
import AttendeesList from "@/components/AttendeesList";
import SearchField from "@/components/SearchField";
import { useApiToken } from "@/hooks/useApiToken";
import { useAttendees } from "@/hooks/useAttendees";
import { useSyncEvents } from "@/hooks/useSyncEvents";
import { useColumns } from "@/hooks/useColumns";
import { useSearch } from "@/hooks/useSearch";

function App() {
  const { token, isLoading: tokenLoading, updateToken } = useApiToken();
  const { attendees, isLoading: attendeesLoading, refresh } = useAttendees();
  const { sync, isSyncing } = useSyncEvents();
  const {
    availableColumns,
    selectedColumns,
    isLoading: columnsLoading,
    updateSelectedColumns,
    refresh: refreshColumns,
  } = useColumns();
  const {
    searchQuery,
    setSearchQuery,
    searchableColumns,
    updateSearchableColumns,
    filteredAttendees,
    isLoading: searchLoading,
    refresh: refreshSearch,
  } = useSearch(attendees);

  const [settingsOpened, setSettingsOpened] = useState(false);

  // Ouvrir automatiquement le modal si pas de token
  useEffect(() => {
    if (!token && !tokenLoading) {
      setSettingsOpened(true);
    }
  }, [token, tokenLoading]);

  const handleSync = async () => {
    await sync(token);
    await refresh();
    await refreshColumns();
    await refreshSearch();
  };

  const handleSaveToken = (newToken: string) => {
    updateToken(newToken);
  };

  if (tokenLoading || attendeesLoading || columnsLoading || searchLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container fluid p="md">
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Title order={2}>BilletLove</Title>
          <Button variant="subtle" onClick={() => setSettingsOpened(true)}>
            Paramètres
          </Button>
        </Group>

        {/* Search Field */}
        {attendees.length > 0 && (
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher un participant..."
          />
        )}

        {/* Attendees List */}
        <AttendeesList attendees={filteredAttendees} selectedColumns={selectedColumns} />

        {/* Settings Modal */}
        <SettingsModal
          opened={settingsOpened}
          onClose={() => setSettingsOpened(false)}
          currentToken={token}
          onSave={handleSaveToken}
          onSync={handleSync}
          isSyncing={isSyncing}
          availableColumns={availableColumns}
          selectedColumns={selectedColumns}
          onColumnsChange={updateSelectedColumns}
          searchableColumns={searchableColumns}
          onSearchableColumnsChange={updateSearchableColumns}
        />
      </Stack>
    </Container>
  );
}

export default App;
