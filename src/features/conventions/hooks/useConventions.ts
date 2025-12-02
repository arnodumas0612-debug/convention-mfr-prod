import { useEffect } from 'react';
import { useConventionsStore } from '../../../store/conventionsStore';
import { supabase } from '../../../lib/supabase';

export const useConventions = () => {
  const { setConventions, setLoading } = useConventionsStore();

  const loadConventions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('conventions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setConventions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadConventions();
  }, []);

  return { loadConventions };
};
