'use client';

import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetSponsorDeals from "@/hooks/query/useGetSponsorDeals";
import { useDebounce } from "@/hooks/utils/useDebounce";
import { SponsorDealApiItem, SponsorDealApiResponse } from "@/lib/types";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { createSponsorDealColumns, SponsorDeal } from "./sponsored-deal-columns";
import SponsoredDealDataSection from "./sponsored-deal-data-section";
import SponsoredDealHeaderSection from "./sponsored-deal-header-section";



export default function SponsoredDeal() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dealId, setDealId] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  // Debounce search term
  const debouncedDealId = useDebounce(dealId);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedDealId]);

  const { data: sponsorDealsData, isPending: isSponsorDealsPending, error: sponsorDealsError, isError: isSponsorDealsError, refetch: refetchSponsorDeals } = useGetSponsorDeals({
    page: currentPage,
    size: pageSize,
    dealId: debouncedDealId.trim() || undefined,
  });

  // Extract data from API response
  const apiData = sponsorDealsData?.data as SponsorDealApiResponse | undefined;

  // Map API data to SponsorDeal format using useMemo
  const deals = useMemo(() => {
    const sponsorDeals = apiData?.content || [];
    if (!Array.isArray(sponsorDeals)) return [];

    return sponsorDeals.map((item: SponsorDealApiItem): SponsorDeal => ({
      id: item.id,
      heading: item.heading || "",
      description: item.description || "",
      dealId: item.dealId || "",
      backgroundImage: item.backgroundImage || "",
      isActive: item.isActive,
      createdAt: item.createdAt || "",
      updatedAt: item.updatedAt || "",
    }));
  }, [apiData?.content]);

  // Get pagination info from API response
  const totalRows = apiData?.totalElements || 0;
  const totalPages = apiData?.totalPages || 0;

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageDialogOpen(true);
  };

  const handleResetFilter = () => {
    setDealId("");
    setCurrentPage(0);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const columns = createSponsorDealColumns({
    onImageClick: handleImageClick,
    currentPage,
    pageSize: pageSize,
  });

  if (isSponsorDealsPending) {
    return <LoadingSpinner message="Loading sponsored deals..." />;
  }

  if (isSponsorDealsError) {
    return (
      <ErrorState
        title="Error Loading Sponsored Deals"
        message={sponsorDealsError?.message || "Failed to load sponsored deals. Please try again."}
        onRetry={refetchSponsorDeals}
        retryText="Retry"
      />
    );
  }

  return (
    <div className="w-full">
      <div className="my-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sponsored Deals</h1>
        <p className="text-gray-600">Manage and view all sponsored deal advertisements</p>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <SponsoredDealHeaderSection
          dealId={dealId}
          onDealIdChange={setDealId}
          onResetFilter={handleResetFilter}
        />

        <SponsoredDealDataSection data={deals} columns={columns} />

        {deals.length > 0 && (
          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRows={totalRows}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-4xl w-full p-0" showCloseButton={true}>
          <DialogTitle className="sr-only">Sponsor Deal Image Preview</DialogTitle>
          {selectedImage && (
            <div className="relative w-full h-[80vh] bg-black">
              <Image
                src={selectedImage}
                alt="Full screen sponsor deal image"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
