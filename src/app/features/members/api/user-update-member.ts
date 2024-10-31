import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.members[":memberId"]["$patch"], 200>;
type ResquestType = InferRequestType<typeof client.api.members[":memberId"]["$patch"]>;

export const useUpdateMember = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        ResquestType
    >({
        mutationFn: async ({param, json}) => {
            const response = await client.api.members[":memberId"]["$patch"]({param, json});
            
            if(!response.ok){
                throw new Error("Somthing went wrong in update");
            }   

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Member updated");
            queryClient.invalidateQueries({queryKey: ["members"]});
        },
        onError: () => {
            toast.error("Failed to update member");
        }
    });

    return mutation;
}



