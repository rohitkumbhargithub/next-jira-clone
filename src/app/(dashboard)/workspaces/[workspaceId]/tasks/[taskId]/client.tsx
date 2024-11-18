"use client"

import { useGetTask } from "@/app/features/tasks/api/use-get-task";
import { TaskBreadcrumbs } from "@/app/features/tasks/components/task-breadcrumbs";
import { TaskDescription } from "@/app/features/tasks/components/task-description";
import { TaskOverView } from "@/app/features/tasks/components/task-overview";
import { useTaskId } from "@/app/features/tasks/hooks/use-task-id"
import { DottedSperator } from "@/components/dotted-speator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

export const TaskIdClient = () => {
    const taskId = useTaskId();
    const { data, isLoading } = useGetTask({taskId});

    if(isLoading) {
        return <PageLoader/>
    }

    if(!data) {
        return <PageError message="Task not found" />
    }

    return (
        <div className="flex flex-col">
            <TaskBreadcrumbs project={data.project} task={data} />
            <DottedSperator className="my-3"/>
            <div className="grid grid-cols lg:grid-cols-2 gap-4">
                <TaskOverView task={data} />
                <TaskDescription task={data} />
            </div>
        </div>
    )
}