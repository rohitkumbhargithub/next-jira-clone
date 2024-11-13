"use client"

import { ResponsiveModal } from "@/components/responsive-model"
import { EditTaskFormWrapper } from "./update-task-form-wrapper";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";
import { useEditTasksModal } from "../hooks/use-edit-tasks-modal";

export const EditTaskModal = () => {
    const { taskId, close } = useEditTasksModal();
    return (
        <ResponsiveModal open={!!taskId} onOpenChange={close}>
            {
                taskId && (
                    <EditTaskFormWrapper id={taskId} onCancel={close}/>
                )
            }
        </ResponsiveModal>
    )
}