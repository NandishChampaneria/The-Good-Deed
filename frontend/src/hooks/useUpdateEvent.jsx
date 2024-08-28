import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const useUpdateEvent= () => {
    const queryClient = useQueryClient();
    const eventId = useParams();
    const { mutate: updateEventImg, isLoading: isUpdatingImg } = useMutation({
        mutationFn: async (updatedImg) => {
            try {
                const res = await fetch(`/api/events/update/${eventId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedImg),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to update event");
                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: (updatedEvent) => {
            toast.success("Event updated successfully!");
            queryClient.invalidateQueries(["event", eventId]);
            setSidebarOpen(false);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return { updateEventImg, isUpdatingImg };
}

export default useUpdateEvent;