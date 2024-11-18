"use client";

import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace";
import { UpdateWorkspaceForm } from "@/app/features/workspaces/components/update-workspace-form";
import { useWorkspaceId } from "@/app/features/workspaces/hooks/use-workspaceId";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

export const WorkspaceIdSettingsClient = () => {
    const workspaceId = useWorkspaceId();
    const { data: initialValues, isLoading } = useGetWorkspace({ workspaceId })

    if(isLoading) {
        return <PageLoader />
    }

    if(!initialValues) {
        return <PageError message="Workspace Not Found"/>
    }
    return (
        <div className="w-full lg:max-w-xl">
            <UpdateWorkspaceForm initialValues={initialValues} />
        </div>
    )
}