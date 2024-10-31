import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { getWorkspace } from "@/app/features/workspaces/server/queries";
import { UpdateWorkspaceForm } from "@/app/features/workspaces/components/update-workspace-form";

interface WorkspaceIdSettingsPageProps {
    params: {
        workspaceId: string;
    }
}

const WorkspaceIdSettingsPage = async ({
    params,
}: WorkspaceIdSettingsPageProps) => {
    const user = await getCurrent();

    if(!user) redirect("/sign-in");

    const initialValues = await getWorkspace({ workspaceId: params.workspaceId});

    if(!initialValues){
        return redirect(`/workspaces/${params.workspaceId}`);
    }
    return (
        <div className="w-full lg:max-w-xl">
            <UpdateWorkspaceForm initialValues={initialValues} />
        </div>
    )
}

export default WorkspaceIdSettingsPage;