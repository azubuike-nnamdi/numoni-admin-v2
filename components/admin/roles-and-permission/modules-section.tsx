import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useDeleteModule } from "@/hooks/mutation/useDeleteModule";
import useGetAllModules from "@/hooks/query/useGetAllModules";
import { MoreVertical, Shield } from "lucide-react";

interface Module {
  id: string;
  moduleName: string | null;
}

export default function ModulesSection() {
  const { data, isPending, isError, error, refetch } = useGetAllModules();
  const { handleDeleteModule: handleDeleteModuleMutation, isPending: isDeletingModule } = useDeleteModule();
  const allModules: Module[] = data?.data?.data ?? [];




  const handleDeleteModule = (moduleId: string) => {
    handleDeleteModuleMutation({ moduleId });
  };

  if (isPending || isDeletingModule) {
    return <LoadingSpinner message={isDeletingModule ? "Deleting module..." : "Loading modules..."} />
  }

  if (isError) {
    return (
      <ErrorState
        title="Error Loading Modules"
        message={error?.message || "Failed to load modules. Please try again."}
        onRetry={refetch}
        retryText="Try Again"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allModules.map((module) => (
        <div
          key={module.id}
          className="bg-white rounded-lg  p-6  duration-200"
        >
          {/* Header with icon and title */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <div className="text-green-600">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {module.moduleName || "Unnamed Module"}
                </h3>
              </div>
            </div>

            {/* 3 dots menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleDeleteModule(module.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Delete Module
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </div>
      ))}

      {/* Empty state */}
      {allModules.length === 0 && (
        <div className="col-span-full">
          <EmptyState
            title="No modules found"
            description="Get started by creating your first module to organize your system functionality."
          />
        </div>
      )}
    </div>
  );
}