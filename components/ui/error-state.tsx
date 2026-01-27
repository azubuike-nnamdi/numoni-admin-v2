import { Frown, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Error Loading Data",
  message,
  onRetry,
  retryText = "Retry",
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 px-8 ${className}`}>

      <div className="w-16 h-16 mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <Frown className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-4">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="flex items-center gap-2 bg-theme-dark-green hover:bg-theme-dark-green/90 text-white p-6 rounded-lg font-medium transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          {retryText}
        </Button>
      )}
    </div>
  );
};
