import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';
import type { Attendee } from '@/utils/types';

export function useAttendees() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAttendees();
  }, []);

  const loadAttendees = async () => {
    setIsLoading(true);
    const all = await storage.attendees.getAll();
    setAttendees(all);
    setIsLoading(false);
  };

  const refresh = async () => {
    await loadAttendees();
  };

  return { attendees, isLoading, refresh };
}
