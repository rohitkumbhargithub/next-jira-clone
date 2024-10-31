import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.projects[":projectId"]["$delete"], 200>;
type ResquestType = InferRequestType<typeof client.api.projects[":projectId"]["$delete"]>;

export const useDeleteProject = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        ResquestType
    >({
        mutationFn: async ({ param}) => {
            const response = await client.api.projects[":projectId"]["$delete"]({ param });
            
            if(!response.ok){
                throw new Error("Somthing went wrong");
            }

            return await response.json();
        },
        onSuccess: ({data}) => {
            toast.success("Project deleted");
            router.refresh();
            queryClient.invalidateQueries({queryKey: ["projects"]})
            queryClient.invalidateQueries({queryKey: ["project", data.$id]})
        },
        onError: () => {
            toast.error("Failed to delete project");
        }
    });

    return mutation;
}



