import { redirect } from "next/navigation";
import { CreateWorkspaceForm } from "@/app/features/workspaces/components/create-workspace-form";
import { getCurrent } from "@/features/auth/queries";


const WorksapceCreatePage = async () => {
    const user = await getCurrent();

    if(!user) redirect("/sign-in");

    return (
        <div className="w-full lg:max-w-xl">
            <CreateWorkspaceForm/>
        </div>
    )
}

export default WorksapceCreatePage;
