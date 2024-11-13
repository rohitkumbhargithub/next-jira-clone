import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries"
import { TaskViewSwitcher } from "@/app/features/tasks/components/task-viewer-switcher";

const TasksPage = async () => {
    const user = await getCurrent();

    if(!user) redirect("/sign-in");

    return (
        <div className="h-full flexs flex-col">
            <TaskViewSwitcher hideProjectFilter/>
        </div>
    )
}

export default TasksPage;