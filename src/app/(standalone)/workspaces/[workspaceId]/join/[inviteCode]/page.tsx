import { redirect } from "next/navigation";
import { GetWorkspaceInfo } from "@/app/features/workspaces/server/queries";
import { getCurrent } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/app/features/workspaces/components/join-workspace-form";

interface WorkspaceIdJoinPageProps {
    params: {
        workspaceId: string;
    }
}

const WorkspaceIdJoinPage = async ({
    params,
}: WorkspaceIdJoinPageProps) => {
    const user = await getCurrent();
    if(!user) redirect("/sign-in");

    const initialValues = await GetWorkspaceInfo({
        workspaceId: params.workspaceId,

    })

    if(!initialValues){
        redirect("/")
    }

    return (
        <div className="w-full lg:max-w-xl">
            <JoinWorkspaceForm initialValues={initialValues}
            />
        </div>
    )
}

export default WorkspaceIdJoinPage;