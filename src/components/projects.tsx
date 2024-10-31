"use client"

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";
import { useGetProjects } from "@/app/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/app/features/workspaces/hooks/use-workspaceId";
import { useCreateProjectsModal } from "@/app/features/projects/hooks/use-create-projects-modal";
import { ProjectAvatar } from "@/app/features/projects/components/project-avatar";

const Projects = () => {
    const pathname = usePathname();
    const workspaceId = useWorkspaceId();
    const { open } = useCreateProjectsModal();
    const { data } = useGetProjects({
        workspaceId,
    });

    return (
        <>
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Projects</p>
                <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
            </div>

            {data?.documents.map((project)=> {
                const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
                const isActive = pathname === href;

                return (
                    <Link href={href} key={project.$id}>
                        <div className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                            isActive && "bg-white shadow-sm hover:opacity text-primary"
                        )}>
                            <ProjectAvatar image={project.imageUrl} name={project.name}/>
                            <span className="truncate">{project.name}</span>

                        </div>
                    </Link>
                )
            })}
        </div>
        </>
    )
}

export default Projects;