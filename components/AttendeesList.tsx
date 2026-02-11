import { Table, ScrollArea, Center, Stack, Text, Title, Modal } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import { useMemo, useState } from 'react';
import type { Attendee } from '@/utils/types';
import { flattenObject, formatKeyForDisplay } from '@/utils/flatten';
import { formatCellValue } from '@/utils/column-formatters';

interface AttendeesListProps {
  attendees: Attendee[];
  selectedColumns?: string[];
}

export default function AttendeesList({ attendees, selectedColumns = ['firstname', 'name', 'email', 'event_name'] }: AttendeesListProps) {
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null);

  // Pré-calculer les données aplaties pour éviter de recalculer à chaque render
  const records = useMemo(() => {
    return attendees.map((attendee) => {
      const flatData = flattenObject(attendee.raw);
      const dataMap = Object.fromEntries(flatData.map(({ key, value }) => [key, value]));
      return {
        id: attendee.id,
        _attendee: attendee,
        ...dataMap,
      };
    });
  }, [attendees]);

  // Générer les colonnes dynamiquement
  const columns = useMemo(() => {
    return selectedColumns.map((column) => ({
      accessor: column,
      title: formatKeyForDisplay(column),
      render: (record: Record<string, unknown>) => formatCellValue(column, record[column] ?? ''),
    }));
  }, [selectedColumns]);

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

  return (
    <Stack gap="md">
      <Title order={3}>Participants ({attendees.length})</Title>

      <DataTable
        height={500}
        withTableBorder
        striped
        highlightOnHover
        records={records}
        columns={columns}
        onRowClick={({ record }) => setSelectedAttendee(record._attendee as Attendee)}
      />

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
