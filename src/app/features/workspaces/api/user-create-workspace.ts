

import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<typeof client.api.workspaces["$post"]>;
type ResquestType = InferRequestType<typeof client.api.workspaces["$post"]>;

export const useCreateWorkspace = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        ResquestType
    >({
        mutationFn: async ({form}) => {
            const response = await client.api.workspaces["$post"]({ form });
            
            if(!response.ok){
                throw new Error("Somthing went wrong");
            }

            return await response.json();
        },
        onSuccess: () => {
            toast.success("Workspace created");
            router.refresh();
            queryClient.invalidateQueries({queryKey: ["workspaces"]})
        },
        onError: () => {
            toast.error("Failed to create work");
        }
    });

    return mutation;
}



