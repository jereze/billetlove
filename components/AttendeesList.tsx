import { Table, ScrollArea, Center, Stack, Text, Title, Button, Modal } from '@mantine/core';
import { useState } from 'react';
import type { Attendee } from '@/utils/types';
import { flattenObject, formatKeyForDisplay } from '@/utils/flatten';
import { formatCellValue } from '@/utils/column-formatters';

interface AttendeesListProps {
  attendees: Attendee[];
  selectedColumns?: string[];
}

export default function AttendeesList({ attendees, selectedColumns = ['firstname', 'name', 'email', 'event_name'] }: AttendeesListProps) {
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);
  if (attendees.length === 0) {
    return (
      <Center h={200}>
        <Stack align="center" gap="xs">
          <Text c="dimmed" size="lg">Aucun participant</Text>
          <Text c="dimmed" size="sm">
            Synchronisez vos événements pour afficher les participants
          </Text>
        </Stack>
      </Center>
    );
  }

  const rows = attendees.map((attendee) => {
    // Aplatir les données pour accéder à toutes les colonnes
    const flatData = flattenObject(attendee.raw);
    const dataMap = new Map(flatData.map(({ key, value }) => [key, value]));

    return (
      <Table.Tr key={attendee.id}>
        {selectedColumns.map((column) => {
          const rawValue = dataMap.get(column) || '';
          const formattedValue = formatCellValue(column, rawValue);
          return <Table.Td key={column}>{formattedValue}</Table.Td>;
        })}
        <Table.Td>
          <Button
            size="xs"
            variant="light"
            onClick={() => setSelectedAttendee(attendee)}
          >
            Détails
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Stack gap="md">
      <Title order={3}>Participants ({attendees.length})</Title>

      <ScrollArea>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {selectedColumns.map((column) => (
                <Table.Th key={column}>{formatKeyForDisplay(column)}</Table.Th>
              ))}
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Modal de détails */}
      <Modal
        opened={selectedAttendee !== null}
        onClose={() => setSelectedAttendee(null)}
        title={`Détails - ${selectedAttendee?.firstName} ${selectedAttendee?.lastName}`}
        size="xl"
      >
        {selectedAttendee && (
          <ScrollArea h={500}>
            <Table striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Champ</Table.Th>
                  <Table.Th>Valeur</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {flattenObject(selectedAttendee.raw).map(({ key, value }) => {
                  const formattedValue = formatCellValue(key, value);
                  return (
                    <Table.Tr key={key}>
                      <Table.Td style={{ fontWeight: 500, width: '40%' }}>
                        {formatKeyForDisplay(key)}
                      </Table.Td>
                      <Table.Td style={{ wordBreak: 'break-word' }}>{formattedValue}</Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Modal>
    </Stack>
  );
}
