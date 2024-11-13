
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$delete"], 200>;
type ResquestType = InferRequestType<typeof client.api.tasks[":taskId"]["$delete"]>;

export const useDeleteTask = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        ResquestType
    >({
        mutationFn: async ({param}) => {
            const response = await client.api.tasks[":taskId"]["$delete"]({ param });
            
            if(!response.ok){
                throw new Error("Somthing went wrong task deleted");
            }

            return await response.json();
        },
        onSuccess: ({data}) => {
            toast.success("Task deleted");
            router.refresh();
            queryClient.invalidateQueries({queryKey: ["tasks"]});
            queryClient.invalidateQueries({queryKey: ["task", data.$id]});
        },
        onError: () => {
            toast.error("Failed to delete task");
        }
    });

    return mutation;
}



