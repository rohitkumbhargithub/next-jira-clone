import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { UpdateWorkspaceForm } from "@/app/features/workspaces/components/update-workspace-form";
import { WorkspaceIdSettingsClient } from "./client";


const WorkspaceIdSettingsPage = async () => {
    const user = await getCurrent();

    if(!user) redirect("/sign-in");

    return <WorkspaceIdSettingsClient />
}

export default WorkspaceIdSettingsPage;