"use client";

import Link from "next/link";
import { ProjectAvatar } from "@/app/features/projects/components/project-avatar";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjectId } from "@/app/features/projects/hooks/use-project-id";
import { TaskViewSwitcher } from "@/app/features/tasks/components/task-viewer-switcher";
import { useGetProject } from "@/app/features/projects/api/use-get-project";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { useGetProjectAnalytics } from "@/app/features/projects/api/use-get-project-analytics";
import { Analytics } from "@/components/analytics";

const ProjectIdClient = () => {

    const projectId = useProjectId();
    const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
    const { data: analytics, isLoading: isLoadingAnalytics } = useGetProjectAnalytics({ projectId });

    const isLoading = isLoadingAnalytics || isLoadingProject;

    if(isLoading) {
        return <PageLoader />
    }

    if(!project) {
        return <PageError message="Project Not Found"/>
    }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            classname="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
          >
            <PencilIcon className="size-4 mr-2" />
            Edit Project
          </Link>
        </Button>
      </div>
      {
        analytics ? (
          <Analytics data={analytics} />
        ) : (
          null
        )
      }
      
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
};

export default ProjectIdClient;



