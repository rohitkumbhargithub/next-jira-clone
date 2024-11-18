"use client";

import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateWorkspaceSchema } from "../schemas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DottedSperator } from "@/components/dotted-speator";
import { Workspace } from "../types";
import { useUpdateWorkspace } from "../api/user-update-workspace";
import { useDeleteWorkspace } from "../api/user-delete-workspace";
import { useResetInviteCode } from "../api/user-reset-invite-code";

interface UpdateWorkspaceFormProps {
    onCancel?: () => void;
    initialValues: Workspace;
};

export const UpdateWorkspaceForm = ({ onCancel, initialValues }: UpdateWorkspaceFormProps) => {
    const router = useRouter();
    const { mutate, isPending } = useUpdateWorkspace();
    const { mutate: deleteWorkspace, 
        isPending: isDeletingWorkspace 
    } = useDeleteWorkspace();
    const { mutate: resetInviteCode, 
        isPending: isResettingInviteCode 
    } = useResetInviteCode();

    const [ DeleteDialog, confirmDelete ] = useConfirm(
        "Delete Workspace",
        "This action cannot be undone",
        "destructive"
    )
    const [ ResetDialog, confirmReset ] = useConfirm(
        "Reset Invite Code",
        "This will invalidate the current invite link",
        "destructive"
    )

    const inputRef = useRef<HTMLInputElement>(null)
    
    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues: {
            ...initialValues,
            image: initialValues.imageUrl ?? "",
        }
    });

    const handleDelete = async () => {
        const ok = await confirmDelete();

        if(!ok) return;

        deleteWorkspace({
            param: { workspaceId: initialValues.$id},
        }, {
            onSuccess: () => {
                // router.push("/")
                window.location.href = "/"
            }
        })
    }

    const handleResetInviteCode = async () => {
        const ok = await confirmReset();

        if(!ok) return;

        resetInviteCode({
            param: { workspaceId: initialValues.$id},
        })
    }

    const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : "",
        }
        mutate({ form: finalValues, param: {workspaceId: initialValues.$id} }); 
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            form.setValue("image", file)
        }
    };

    const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

    const handleCopyInviteLink = () => {
        navigator.clipboard.writeText(fullInviteLink)
            .then(() => toast.success("Invite Code Copied to clipboard"));
    }


    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialog/>
            <ResetDialog/>
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
                <Button size="sm" variant="secondary" onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}>
                    <ArrowLeftIcon className="size-4 mr-2"/>
                    Back
                </Button>
                <CardTitle className="text-xl font-bold">
                    {initialValues.name}
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <DottedSperator/>
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Worksapce Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter Workspace Name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                 <div className="flex flex-col gap-y-2">
                                    <div className="flex items-center gap-x-5">
                                        {field.value ? (
                                            <div className="size-[100px] relative rounded-md overflow-hidden">
                                            <Image 
                                                alt="Logo"
                                                fill
                                                className="object-cover"
                                                src={
                                                field.value instanceof File
                                                ? URL.createObjectURL(field.value)
                                                : field.value
                                            }
                                            />
                                            </div>
                                        ):(
                                            <Avatar className="size-[72px]">
                                                <AvatarFallback>
                                                    <ImageIcon className="size-[36px] text-neutral-500"/>
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="flex flex-col">
                                            <p className="text-sm">Workspace Icon</p>
                                            <p className="text-sm text-muted-foreground">
                                                JPG, PNG, SVG or JPEG, max 1mb
                                            </p>
                                            <input type="file"
                                             className="hidden"
                                             accept=".jpg, .png, .jpeg, .svg"
                                             ref={inputRef}
                                             onChange={handleImageChange}
                                             disabled={isPending}
                                             />
                                             <Button
                                                type="button"
                                                disabled={isPending}
                                                className="w-fit mt-2 bg-blue-500"
                                                onClick={() => inputRef.current?.click()}
                                             >Upload Image</Button>
                                        </div>
                                    </div>
                                 </div>
                            )}
                        />

                    </div>
                    <DottedSperator className="py-7"/>
                    <div className="flex items-center justify-between">
                    <Button
                       type="button"
                       variant="secondary"
                       size="lg"
                       onClick={onCancel}
                       className={cn(onCancel ? "visible": "invisible")}
                       disabled={isPending}
                    >Cancel</Button>

                    <Button
                       type="submit"
                       size="lg"  
                       disabled={isPending} 
                       
                    >Save the Changes</Button>
                    </div>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <Card className="w-full h-full border-none shadow-none">
            <CardContent className="p-7">
                <div className="flex flex-col">
                    <h3 className="font-bold">Invite Memeber</h3>
                    <p className="text-sm text-muted-foreground">
                        Use the invite link to add memebers to your workspace
                    </p>
                    <div className="mt-4">
                        <div className="flex items-center gap-x-2">
                            <Input disabled value={fullInviteLink} />
                            <Button onClick={handleCopyInviteLink} variant="secondary" className="size-10">
                                <CopyIcon/>
                            </Button>
                        </div>
                    </div>
                    <DottedSperator className="py-7"/>
                    <Button className="mt-6 w-fit ml-auto"
                        size="sm"
                        variant="outline"
                        type="button"
                        disabled={isPending || isResettingInviteCode  }
                        onClick={handleResetInviteCode}
                    >Reset Invite Link</Button>
                </div>
            </CardContent>
        </Card>
        
        <Card className="w-full h-full border-none shadow-none">
            <CardContent className="p-7">
                <div className="flex flex-col">
                    <h3 className="font-bold">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground">
                        Deleting a workspace is irrevesible and will remove all assocaiated data
                    </p>
                    <DottedSperator className="py-7"/>
                    <Button className="mt-6 w-fit ml-auto"
                        size="sm"
                        variant="destructive"
                        type="button"
                        disabled={isPending || isDeletingWorkspace  }
                        onClick={handleDelete}
                    >Delete Workspace</Button>
                </div>
            </CardContent>
        </Card>

        </div>
    )
}