import { ExternalLinkIcon, TrashIcon, PencilIcon } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "../../workspaces/hooks/use-workspaceId";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { useDeleteTask } from "../api/use-delete-task";
import { useEditTasksModal } from "../hooks/use-edit-tasks-modal";

interface TaskActionProps {
    id: string,
    projectId: string,
    children: React.ReactNode,
};

export const TaskActions = ({id, projectId, children}: TaskActionProps ) => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();

    const { open } = useEditTasksModal();

    const [ DeleteDialog, confirmDelete ] = useConfirm(
        "Delete task",
        "This action cannot be undone",
        "destructive"
    )

    const { mutate, isPending } = useDeleteTask();


    const handleDelete = async () => {
        const ok = await confirmDelete();

        if(!ok) return;

       mutate({ param: {taskId: id} })
    }

    const onOpenTask = () => {
        router.push(`/workspaces/${workspaceId}/tasks/${id}`)
    }

    const onOpenProject = () => {
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
    }

    return (
        <div className="flex justify-end">
            <DeleteDialog/> 
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    {children}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                        onClick={onOpenTask}
                        // disabled={false}
                        className="font-medium p-[10px]"
                    >
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2"/>
                        Task Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={onOpenProject}
                        // disabled={false}
                        className="font-medium p-[10px]"
                    >
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2"/>
                        Open Project
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => open(id)}
                        // disabled={false}
                        className="font-medium p-[10px]"
                    >
                        <PencilIcon className="size-4 mr-2 stroke-2"/>
                        Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={handleDelete}
                        disabled={isPending}
                        className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
                    >
                        <TrashIcon className="size-4 mr-2 stroke-2"/>
                        Delete Task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}