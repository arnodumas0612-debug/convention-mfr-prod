import { Spinner } from './Spinner';

interface LoadingOverlayProps {
  message?: string;
}

export const LoadingOverlay = ({ message = 'Chargement...' }: LoadingOverlayProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};
