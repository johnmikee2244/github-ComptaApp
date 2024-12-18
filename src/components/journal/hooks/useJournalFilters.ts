import { useState, useCallback } from 'react';
import { JournalFilters, JournalEntry, JournalType } from '../../../types/journal';

interface UseJournalFiltersReturn {
  filteredEntries: JournalEntry[];
  applyFilters: (filters: JournalFilters, journalType?: JournalType) => void;
}

export function useJournalFilters(entries: JournalEntry[]): UseJournalFiltersReturn {
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>(entries);

  const applyFilters = useCallback((
    filters: JournalFilters,
    journalType?: JournalType
  ) => {
    let filtered = journalType 
      ? entries.filter(entry => entry.journalType === journalType)
      : entries;

    if (filters.startDate) {
      filtered = filtered.filter(entry => entry.date >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter(entry => entry.date <= filters.endDate!);
    }
    if (filters.reference) {
      filtered = filtered.filter(entry => 
        entry.reference.toLowerCase().includes(filters.reference!.toLowerCase())
      );
    }
    if (filters.validated !== undefined) {
      filtered = filtered.filter(entry => entry.validated === filters.validated);
    }

    setFilteredEntries(filtered);
  }, [entries]);

  return { filteredEntries, applyFilters };
}