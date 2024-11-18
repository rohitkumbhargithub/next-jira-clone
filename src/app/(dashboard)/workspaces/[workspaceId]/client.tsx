"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { Task } from "@/app/features/tasks/types";
import { useGetWorkspaceAnalytics } from "@/app/features/workspaces/api/use-get-workspace-analytics";
import { useWorkspaceId } from "@/app/features/workspaces/hooks/use-workspaceId";
import { useGetTask } from "@/app/features/tasks/api/use-get-tasks";
import { useGetProjects } from "@/app/features/projects/api/use-get-projects";
import { useGetMembers } from "@/app/features/members/api/user-get-member";
import { useCreateProjectsModal } from "@/app/features/projects/hooks/use-create-projects-modal";
import { useCreateTasksModal } from "@/app/features/tasks/hooks/use-create-tasks-modal";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { Analytics } from "@/components/analytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DottedSperator } from "@/components/dotted-speator";
import { Project } from "@/app/features/projects/types";
import { ProjectAvatar } from "@/app/features/projects/components/project-avatar";
import { Member } from "@/app/features/members/types";
import { MemberAvatar } from "@/app/features/members/components/member-avatar";


const WorkspaceIdClient = async () => {
    const workspaceId = useWorkspaceId();
    const { data: analytics, isLoading: isLoadingAnalytics  } = useGetWorkspaceAnalytics({
        workspaceId
    });
    const { data: tasks, isLoading: isLoadingTasks  } = useGetTask({
        workspaceId
    });
    const { data: projects, isLoading: isLoadingProjects  } = useGetProjects({
        workspaceId
    });
    const { data: members, isLoading: isLoadingMembers  } = useGetMembers({
        workspaceId
    });

    const isLoading = isLoadingAnalytics || isLoadingMembers || isLoadingTasks || isLoadingProjects;

    if(isLoading) {
        return <PageLoader />
    }

    if(!analytics || !members || !projects || !tasks) {
        return <PageError message="Failed to load workspaces data" />
    }

    return (
        <div className="h-full flex flex-col space-y-4">
            <Analytics data={analytics} /> 
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <TaskList data={tasks.documents} total={tasks.total}/>
                <ProjectList data={projects.documents} total={projects.total} />
                <MemberList data={members.documents} total={members.total} />
            </div> 
        </div>
    )
}

export default WorkspaceIdClient;

interface TaskListProps {
    data: Task[];
    total: number;
}

export const TaskList = ({ data, total }: TaskListProps) => {
    const { open: createTask } = useCreateTasksModal();
    const workspaceId = useWorkspaceId();
    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Tasks ({total})
                    </p>
                    <Button variant="secondary" size="icon" onClick={createTask} >
                        <PlusIcon className="size-4 text-neutral-400" />
                    </Button>
                </div>
                <DottedSperator className="my-4" />
                <ul className="flex flex-col gap-y-4">
                    {
                        data.map((task) => (
                            <li key={task.$id}>
                                <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                                    <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                                        <CardContent className="p-4">
                                            <p className="text-lg font-medium truncate">{task.name}</p>
                                            <div className="flex items-center gap-x-2">
                                                <p>{task.project?.name}</p>
                                                <div className="size-1 rounded-full bg-neutral-300" />
                                                    <div className="text-sm text-muted-foreground flex items-center">
                                                        <CalendarIcon className="size-3 mr-1" />
                                                        <span className="truncate">
                                                            {formatDistanceToNow(new Date(task.dueDate))}
                                                        </span>
                                                    </div>
                                                </div>
                                        </CardContent> 
                                    </Card>
                                </Link>
                            </li>
                        ))
                    }
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No Tasks Found.
                    </li>
                </ul>
                <Button variant="secondary" className="mt-4 w-full" asChild>
                    <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
                </Button>
            </div>
        </div>
    )
}


interface ProjectListProps {
    data: Project[];
    total: number;
}

export const ProjectList = ({ data, total }: ProjectListProps) => {
    const { open: createProject } = useCreateProjectsModal();
    const workspaceId = useWorkspaceId();
    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Projects ({total})
                    </p>
                    <Button variant="secondary" size="icon" onClick={createProject} >
                        <PlusIcon className="size-4 text-neutral-400" />
                    </Button>
                </div>
                <DottedSperator className="my-4" />
                <ul className="grid grid-col-1 lg:grid-cols-2 gap-4">
                    {
                        data.map((project) => (
                            <li key={project.$id}>
                                <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                                    <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                                        <CardContent className="p-4 flex items-center gap-x-2.5">
                                            <ProjectAvatar
                                                classname="size-12"
                                                fallbackClassName="text-lg"
                                                name={project.name}
                                                image={project.imageUrl}
                                            />
                                            <p className="text-lg font-medium truncate">
                                                {project.name}
                                            </p>
                                        </CardContent> 
                                    </Card>
                                </Link>
                            </li>
                        ))
                    }
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No Projects Found.
                    </li>
                </ul>
            </div>
        </div>
    )
}


interface MemberListProps {
    data: Member[];
    total: number;
}

export const MemberList = ({ data, total }: MemberListProps) => {
    const workspaceId = useWorkspaceId();
    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Members ({total})
                    </p>
                    <Button asChild variant="secondary" size="icon">
                        <Link href={`/workspaces/${workspaceId}/members`}>
                            <SettingsIcon className="size-4 text-neutral-400" />
                        </Link>
                    </Button>
                </div>
                <DottedSperator className="my-4" />
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {
                        data.map((member) => (
                            <li key={member.$id}>
                                    <Card className="shadow-none rounded-lg overflow-hidden">
                                        <CardContent className="p-3 flex flex-col items-center gap-x-2">
                                            <MemberAvatar
                                                classname="size-12"
                                                name={member.name}
                                            />
                                            <div className="flex flex-col items-center overflow-hidden">
                                            <p className="text-lg font-medium line-clamp-1">
                                                {member.name}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground line-clamp-1">
                                                {member.email}
                                            </p>
                                            </div>
                                        </CardContent> 
                                    </Card>
                               
                            </li>
                        ))
                    }
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No Members Found.
                    </li>
                </ul>
            </div>
        </div>
    )
}