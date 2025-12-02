import { supabase } from '../../../lib/supabase';

export const generateLogin = (firstname: string, lastname: string) => {
  const initial = firstname.charAt(0).toUpperCase();
  const nom = lastname.toUpperCase().replace(/\s+/g, '');
  return `${initial}.${nom}`;
};

export const generatePasswordFromBirthdate = (birthdate: string) => {
  const date = new Date(birthdate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
};

export const createUser = async (userData: {
  firstname: string;
  lastname: string;
  birthdate: string;
  role: 'super_admin' | 'admin' | 'responsable_classe' | 'famille';
}) => {
  const login = generateLogin(userData.firstname, userData.lastname);
  const password = generatePasswordFromBirthdate(userData.birthdate);
  const email = `${login}@mfr-conventions.local`;

  const { data, error } = await supabase
    .from('users')
    .insert([{
      email: email,
      full_name: `${userData.firstname} ${userData.lastname}`,
      role: userData.role,
    }])
    .select()
    .single();

  return {
    data,
    error,
    credentials: {
      login: login,
      password: password,
      email: email,
      role: userData.role
    }
  };
};

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  return { error };
};
