import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"], 200>;
type ResquestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]>;

export const useResetInviteCode = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        ResquestType
    >({
        mutationFn: async ({param}) => {
            const response = await client.api.workspaces[":workspaceId"]["reset-invite-code"]["$post"]({param});
            
            if(!response.ok){
                throw new Error("Somthing went wrong in reste invite code");
            }

            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success("Invite Code Reset");
            queryClient.invalidateQueries({queryKey: ["workspaces"]});
            queryClient.invalidateQueries({queryKey: ["workspaces", data.$id]});
        },
        onError: () => {
            toast.error("Failed to reset invite code");
        }
    });

    return mutation;
}



