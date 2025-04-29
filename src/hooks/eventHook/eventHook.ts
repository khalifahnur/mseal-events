import { createEvent, deleteEvent, editEvent } from "@/lib/api";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { DeleteEvent, DeleteResponse, EditMutationVariables, EditResponse, ErrorResponse, EventData, EventResponse } from "../../../types/event";

type CreateEventInput = Omit<EventData, "_id" | "totalTickets">;

// export function useCreateEvent(): UseMutationResult<
//   EventResponse,
//   ErrorResponse,
//   Omit<CreateEventInput, '_id'>
// > {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: createEvent,
//     onSuccess: (data: EventResponse) => {
//       toast.success(data.message || "Event created successfully");
//       console.log("Event created successfully:", data.event);
//       queryClient.invalidateQueries({ queryKey: ['allEvents'] });
//     },
//     onError: (error: ErrorResponse) => {
//       console.error(
//         `Event creation error (${error.statusCode || "Unknown"}): ${error.message}`,
//         error.details
//       );
//       toast.error(
//         error.message || "An unexpected error occurred. Please try again."
//       );
//     },
//   });
// }

export function useCreateEvent(): UseMutationResult<
  EventResponse,
  ErrorResponse,
  CreateEventInput
> {
  const queryClient = useQueryClient();

  return useMutation<EventResponse, ErrorResponse, CreateEventInput>({
    mutationFn: createEvent,
    onSuccess: (data) => {
      toast.success(data.message || "Event created successfully");
      console.log("Event created successfully:", data.event);
      queryClient.invalidateQueries({ queryKey: ["allEvents"] });
    },
    onError: (error) => {
      console.error(
        `Event creation error (${error.statusCode || "Unknown"}): ${error.message}`,
        error.details
      );
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
    },
  });
}



export function useDeleteEvent(): UseMutationResult<
  DeleteResponse,
  ErrorResponse,
  DeleteEvent
> {
  const queryClient = useQueryClient();
  return useMutation<DeleteResponse, ErrorResponse, DeleteEvent>({
    mutationFn: ({ itemId }) => {
      return deleteEvent( itemId);
    },
    onSuccess: (data: DeleteResponse) => {
      console.log("EVent deleted successfully", data);
      queryClient.invalidateQueries({ queryKey: ['allEvents'] });
    },
    onError: (error: ErrorResponse) => {
      console.error("deleted event error:", error.message);
    },
  });
}



export function useEditEvent(): UseMutationResult<
EditResponse,
ErrorResponse,
EditMutationVariables
> {
  const queryClient = useQueryClient();
return useMutation<EditResponse, ErrorResponse, EditMutationVariables>({
  mutationFn: ({ updatedItem,itemId }) =>
    editEvent(updatedItem,itemId ),
  onSuccess: (data: EditResponse) => {
    console.log("Event item updated successfully", data);
    queryClient.invalidateQueries({ queryKey: ['allEvents'] });
  },
  onError: (error: ErrorResponse) => {
    console.error("Error updating event item:", error.message);
  },
});
}

