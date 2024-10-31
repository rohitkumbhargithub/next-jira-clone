import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.auth.login["$post"]>;
type ResquestType = InferRequestType<typeof client.api.auth.login["$post"]>;

export const useLogin = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        ResquestType
    >({
        mutationFn: async ({json}) => {
            const response = await client.api.auth.login["$post"]({ json });

            if(!response.ok){
                throw new Error("Somthing went wrong");
            }

            return await response.json();
        },
        onSuccess: () => {
            router.refresh(); 
            toast.success("Logged In")
            queryClient.invalidateQueries({queryKey: ["current"]})
        },
        onError: () => {
            toast.error("Failed to Login");
        }
    });

    return mutation;
}



