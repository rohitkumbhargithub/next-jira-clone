"use client";

import { useGetWorkspace } from "@/app/features/workspaces/api/use-get-workspace"
import { useGetWorkspaceInfo } from "@/app/features/workspaces/api/use-get-workspace-info";
import { JoinWorkspaceForm } from "@/app/features/workspaces/components/join-workspace-form";
import { useWorkspaceId } from "@/app/features/workspaces/hooks/use-workspaceId";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";

export const WorkspaceIdJoinClient = () => {

    const workspaceId = useWorkspaceId();
    const { data: initialValues, isLoading } = useGetWorkspaceInfo({ workspaceId })

    if(isLoading) {
        return <PageLoader />
    }

    if(!initialValues) {
        return <PageError message="Workspace info Not Found"/>
    }

    return (
        <div className="w-full lg:max-w-xl">
            <JoinWorkspaceForm initialValues={initialValues} />
        </div>
    )
}