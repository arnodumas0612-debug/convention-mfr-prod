import { useNavigate, useLocation } from 'react-router-dom';
import { ConventionWorkflow } from '../components/ConventionWorkflow';

export const NewConventionPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedClass = location.state?.selectedClass || '';

  const handleComplete = (conventionId: string) => {
    navigate(`/conventions/${conventionId}`);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="px-6">
      <ConventionWorkflow
        onComplete={handleComplete}
        onCancel={handleCancel}
        initialClass={selectedClass}
      />
    </div>
  );
};
