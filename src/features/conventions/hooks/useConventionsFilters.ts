import { useMemo, useState } from 'react';
import { Convention } from '../../../types/convention';

export const useConventionsFilters = (conventions: Convention[]) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConventions = useMemo(() => {
    return conventions.filter((conv) => {
      if (statusFilter !== 'all' && conv.status !== statusFilter) {
        return false;
      }

      if (classFilter !== 'all' && conv.student_class !== classFilter) {
        return false;
      }

      if (typeFilter !== 'all' && conv.convention_type !== typeFilter) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const studentName = `${conv.student_firstname} ${conv.student_lastname}`.toLowerCase();
        const companyName = (conv.company_name || '').toLowerCase();
        const siren = (conv.company_siren || '').toLowerCase();

        return (
          studentName.includes(query) ||
          companyName.includes(query) ||
          siren.includes(query)
        );
      }

      return true;
    });
  }, [conventions, statusFilter, classFilter, typeFilter, searchQuery]);

  const resetFilters = () => {
    setStatusFilter('all');
    setClassFilter('all');
    setTypeFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters = statusFilter !== 'all' || classFilter !== 'all' || typeFilter !== 'all' || searchQuery !== '';

  return {
    filteredConventions,
    statusFilter,
    setStatusFilter,
    classFilter,
    setClassFilter,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    resetFilters,
    hasActiveFilters,
  };
};
