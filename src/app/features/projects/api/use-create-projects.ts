

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.projects["$post"], 200>;
type ResquestType = InferRequestType<typeof client.api.projects["$post"]>;

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        ResquestType
    >({
        mutationFn: async ({form}) => {
            const response = await client.api.projects["$post"]({ form });
            
            if(!response.ok){
                throw new Error("Somthing went wrong");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Project created");
            queryClient.invalidateQueries({queryKey: ["projects"]})
        },
        onError: () => {
            toast.error("Failed to create project");
        }
    });

    return mutation;
}



