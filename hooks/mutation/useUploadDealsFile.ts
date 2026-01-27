import api from "@/lib/api";
import { useMerchantKycStore } from "@/lib/stores/merchant-kyc-store";
import { useUploadStore } from "@/lib/stores/upload-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DocumentType = 'CAC' | 'TIN' | 'TAX' | 'NIN' | null;

export const useUploadDealsFile = () => {
  const queryClient = useQueryClient();

  const { addImagePath } = useUploadStore();
  const {
    setCacDocumentPath,
    setTinPath,
    setReqCertificatePath,
    setMenuPath
  } = useMerchantKycStore();

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: (data: FormData) => api.post("/admin/uploadDealsFile", data),
    onSuccess: (data) => {
      // console.log("Deals file uploaded successfully", data?.data?.data?.imageUrl);

      if (data) {

        // console.log('Data:', data?.data?.data?.imageUrl);
        const imagePath = data?.data?.data?.imageUrl;
        // console.log('imagePath', imagePath);
        if (imagePath) {
          addImagePath(imagePath);
        }
        toast.success(data?.data?.message ?? "Deals file uploaded successfully");
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {

      toast.error(error?.response?.data?.message ?? "Failed to upload deals file");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });

  const handleUploadDealsFile = async (data: FormData, documentType?: DocumentType) => {
    const result = await mutateAsync(data);
    const imagePath = result?.data?.data?.imageUrl;

    // Store the image path in merchant KYC store based on document type
    if (imagePath && documentType) {
      switch (documentType) {
        case 'CAC':
          setCacDocumentPath(imagePath);
          break;
        case 'TIN':
          setTinPath(imagePath);
          break;
        case 'TAX':
          setReqCertificatePath(imagePath);
          break;
        case 'NIN':
          setMenuPath(imagePath);
          break;
      }
    }

    return imagePath;
  };

  return { handleUploadDealsFile, isPending, isSuccess };
};