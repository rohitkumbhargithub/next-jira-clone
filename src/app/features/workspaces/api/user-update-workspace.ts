import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["$patch"], 200>;
type ResquestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["$patch"]>;

export const useUpdateWorkspace = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        ResquestType
    >({
        mutationFn: async ({form, param}) => {
            const response = await client.api.workspaces[":workspaceId"]["$patch"]({ form , param});
            
            if(!response.ok){
                throw new Error("Somthing went wrong in update");
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success("Workspace updated");
            queryClient.invalidateQueries({queryKey: ["workspaces"]});
            queryClient.invalidateQueries({queryKey: ["workspaces", data.$id]});
        },
        onError: () => {
            toast.error("Failed to create work");
        }
    });

    return mutation;
}



