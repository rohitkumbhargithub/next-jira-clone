import Link from "next/link";
import { redirect } from "next/navigation";
import { ProjectAvatar } from "@/app/features/projects/components/project-avatar";
import { getProject } from "@/app/features/projects/queries";
import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/queries";
import { PencilIcon } from "lucide-react";
import { TaskViewSwitcher } from "@/app/features/tasks/components/task-viewer-switcher";

interface ProjectIdPageProps {
    params: { projectId: string };
}

const ProjectIdpage = async ({ params }: ProjectIdPageProps) => {
    const user = await getCurrent();

    if(!user) redirect("/sign-in");

    const initialValues = await getProject({
        projectId: params.projectId
    });

    if(!initialValues){
        throw new Error("Project Not Found!")
    }

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ProjectAvatar
                        name={initialValues.name}
                        image={initialValues.imageUrl}
                        classname="size-8"
                    />
                    <p className="text-lg font-semibold">{initialValues.name}</p>
                </div>
            <Button variant="outline" size="sm" asChild>
                <Link href={`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}/settings`}
                        >
                        <PencilIcon className="size-4 mr-2"/>
                        Edit Project
                </Link>
            </Button>
            
            </div>
            <TaskViewSwitcher/>
        </div>
    )
}

export default ProjectIdpage;