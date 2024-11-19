"use client";

import { RiAddCircleFill } from "react-icons/ri"

import { useRouter } from "next/navigation";
import { useCreateWorkspaceModal } from "@/app/features/workspaces/hooks/use-create-workspace-modal";
import { WorkspaceAvatar } from "@/app/features/workspaces/components/workspace-avatar";
import { useWorkspaceId } from "@/app/features/workspaces/hooks/use-workspaceId";
import { useGetWorkspaces } from "@/app/features/workspaces/api/user-get-workspace";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { SelectValue } from "@radix-ui/react-select";

export const WorkspaceSwitcher = () => {
    const worksapceId = useWorkspaceId();
    const router = useRouter();
    const { data: worksapces } = useGetWorkspaces();
    const { open } = useCreateWorkspaceModal();

    const onSelect = (id: string) => {
        router.push(`/workspaces/${id}`)
    }
    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs uppercase text-neutral-500">Workspaces</p>
                <RiAddCircleFill onClick={open} className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"/>
            </div>
            <Select onValueChange={onSelect} value={worksapceId}>
                <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
                    <SelectValue placeholder="No workspace selected" />
                </SelectTrigger>
                <SelectContent>
                    {worksapces?.documents.map((worksapce) => (
                        <SelectItem key={worksapce.$id} value={worksapce.$id}>
                            <div className="flex justify-start items-center gap-2 font-medium">
                                <WorkspaceAvatar name={worksapce.name} image={worksapce.imageUrl}/>
                                <span className="truncate">{worksapce.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}