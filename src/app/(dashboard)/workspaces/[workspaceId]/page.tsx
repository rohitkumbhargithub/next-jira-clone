import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

interface WorkspaceIdPageProps {
    params: { workspaceId: string };
}

const WorkspaceIdpage = async ({ params }: WorkspaceIdPageProps) => {
    const user = await getCurrent();

    if(!user) redirect("/sign-in");

    return (
        <div>
            Workspace Id: {params.workspaceId}
        </div>
    )
}

export default WorkspaceIdpage;