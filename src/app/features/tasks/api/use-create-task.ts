

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.tasks["$post"], 200>;
type ResquestType = InferRequestType<typeof client.api.tasks["$post"]>;

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        ResquestType
    >({
        mutationFn: async ({json}) => {
            const response = await client.api.tasks["$post"]({ json });
            
            if(!response.ok){
                throw new Error("Somthing went wrong task");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Task created");
            queryClient.invalidateQueries({queryKey: ["tasks"]})
        },
        onError: () => {
            toast.error("Failed to create task");
        }
    });

    return mutation;
}



