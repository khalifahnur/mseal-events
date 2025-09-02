import {
  createMerchandise,
  deleteMerchandise,
  editMerchandise,
  updateOrder,
} from "@/lib/api";
import {
  DeleteMerchandise,
  EditMutationVariables,
  ErrorResponse,
  Merchandise,
  MerchResponse,
} from "../../../types/merch";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteResponse, EditResponse, UpdateMerchandise, UpdateResponse } from "../../../types/event";

export function useCreateMerchandise(): UseMutationResult<
  MerchResponse,
  ErrorResponse,
  Omit<Merchandise, "id">
> {
  return useMutation<MerchResponse, ErrorResponse, Omit<Merchandise, "id">>({
    mutationFn: createMerchandise,
    onSuccess: (data: MerchResponse) => {
      toast.success(data.message || "Merchandise created successfully");
      console.log("Item created successfully:", data.merchandise);
    },
    onError: (error: ErrorResponse) => {
      console.error(
        `Item creation error (${error.statusCode || "Unknown"}): ${
          error.message
        }`,
        error.details
      );
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
    },
  });
}

export function useDeleteMerch(): UseMutationResult<
  DeleteResponse,
  ErrorResponse,
  DeleteMerchandise
> {
  const queryClient = useQueryClient();
  return useMutation<DeleteResponse, ErrorResponse, DeleteMerchandise>({
    mutationFn: ({ itemId }) => {
      return deleteMerchandise(itemId);
    },
    onSuccess: (data: DeleteResponse) => {
      console.log("Merchandise deleted successfully", data);
      queryClient.invalidateQueries({ queryKey: ["allMerchandise"] });
    },
    onError: (error: ErrorResponse) => {
      console.error("deleted merchandise error:", error.message);
    },
  });
}

export function useEditMerch(): UseMutationResult<
  EditResponse,
  ErrorResponse,
  EditMutationVariables
> {
  const queryClient = useQueryClient();
  return useMutation<EditResponse, ErrorResponse, EditMutationVariables>({
    mutationFn: ({ updatedItem, itemId }) =>
      editMerchandise(updatedItem, itemId),
    onSuccess: (data: EditResponse) => {
      console.log("Merchandise updated successfully", data);
      queryClient.invalidateQueries({ queryKey: ["allMerchandise"] });
    },
    onError: (error: ErrorResponse) => {
      console.error("Error updating merchandise :", error.message);
    },
  });
}

export function useUpdateOrder(): UseMutationResult<
  UpdateResponse,
  ErrorResponse,
  UpdateMerchandise
> {
  const queryClient = useQueryClient();
  return useMutation<UpdateResponse, ErrorResponse, UpdateMerchandise>({
    mutationFn: ({ itemId }) => {
      return updateOrder(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error: ErrorResponse) => {
      console.error("Updated merchandise error:", error.message);
    },
  });
}
