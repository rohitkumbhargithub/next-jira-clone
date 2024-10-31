"use client"

import Link from "next/link";
import { Fragment } from "react";
import { Button } from "../../../../components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { MemberAvatar } from "../../members/components/member-avatar";
import { MemberRole } from "../../members/types";
import { useUpdateMember } from "../../members/api/user-update-member";
import { useDeleteMember } from "../../members/api/user-delete-member";
import { useGetMembers } from "@/app/features/members/api/user-get-member";
import { DottedSperator } from "../../../../components/dotted-speator";
import { useWorkspaceId } from "@/app/features/workspaces/hooks/use-workspaceId";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"


export const MemeberList = () => {
    const workspaceId = useWorkspaceId();
    const [ConfirmDialog, confirm] = useConfirm(
        "Remove member",
        "This member will be removed from the workspace",
        "destructive"
    )
    const { data } = useGetMembers({workspaceId});

    const {
        mutate: deleteMember,
        isPending: isDeletingMember
     } = useDeleteMember();

     const {
        mutate: updateMember,
        isPending: isUpdatingMember
     } = useUpdateMember();

     const handleUpdateMember = (memberId: string, role: MemberRole) => {
        updateMember({
            json: { role },
            param: { memberId },
        })
     }

     const handleDeleteMember = async (memberId: string) => {
        const ok = await confirm();
        if(!ok) return;

        deleteMember({param: {memberId}}, {
            onSuccess: () => {
                window.location.reload();
            }
        })
     }

    return (
        <Card className="w-full h-full border-none shadow-none">
            <ConfirmDialog/>
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button asChild variant="outline" size="sm">
                    <Link href={`/workspaces/${workspaceId}`}>
                    <ArrowLeftIcon className="size-4 mr-2"/>
                    Back
                    </Link>
                </Button>
                <CardTitle className="text-xl font-bold">
                    Members List
                </CardTitle>
            </CardHeader>
                <div className="px-7">
                    <DottedSperator/>
                </div>
            <CardContent className="p-7">
                {data?.documents.map((member, index) => (
                    <Fragment key={member.$id}>
                        <div className="flex items-center gap-2">
                            <MemberAvatar classname="size-10"
                            fallbackClassName="text-lg"
                            name={member.name}
                            />
                            <div className="flex flex-col">
                                <p className="text-sm font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                            <Button className="ml-auto"
                                variant="secondary"
                                size="icon"
                            >
                            <MoreVerticalIcon className="size-4 text-muted-foreground" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="bottom" align="end">
                                <DropdownMenuItem className="font-medium"
                                    onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                                    disabled={isUpdatingMember}
                                >
                                Set as Administrator
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-medium"
                                    onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                                    disabled={isUpdatingMember}
                                >
                                Set as Member
                                </DropdownMenuItem>
                                <DropdownMenuItem className="font-medium text-amber-700"
                                    onClick={() => handleDeleteMember(member.$id)}
                                    disabled={isDeletingMember}
                                >
                                Remove {member.name}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        {index < data.documents.length - 1 && (
                            <Separator className="my-2.5" />
                        )}
                    </Fragment>
                ))}
            </CardContent>
        </Card>
    )
}