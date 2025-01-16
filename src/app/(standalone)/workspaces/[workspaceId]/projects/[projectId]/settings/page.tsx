import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { getProject } from "@/app/features/projects/server/queries";
import { EditProjectForm } from "@/app/features/projects/components/edit-project-form";

interface ProjectIdSettigsPageProps {
    params: {
        projectId: string
    }
}

const ProjectIdSettigsPage = async ({
    params
}:ProjectIdSettigsPageProps) => {
    const user = getCurrent();
    if(!user) redirect("/sign-in");
    const initialValues = await getProject({
        projectId: params.projectId,

    })
    return (
        <div className="w-full lg:max-w-xl">
            <EditProjectForm initialValues={initialValues}/>
        </div>
    )
}

export default ProjectIdSettigsPage;