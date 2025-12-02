import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../components/AdminDashboard';
import { Convention } from '../types/convention';

export const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const handleViewConvention = (convention: Convention) => {
    navigate(`/conventions/${convention.id}`);
  };

  return <AdminDashboard onViewConvention={handleViewConvention} />;
};
