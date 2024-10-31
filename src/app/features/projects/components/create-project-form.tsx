"use client";

import { z } from "zod";
import { useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWorkspaceId } from "../../workspaces/hooks/use-workspaceId";
import { createProjectSchema } from "../schema";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DottedSperator } from "@/components/dotted-speator";
import { useCreateProject } from "../api/use-create-projects";

interface CreateProjectFormProps {
    onCancel?: () => void;
};

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
    const workspaceId = useWorkspaceId();
    const router = useRouter();
    const { mutate, isPending } = useCreateProject();
    const inputRef = useRef<HTMLInputElement>(null)
    
    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
        defaultValues: {
            name: "",
        }
    });

    const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
        const finalValues = {
            ...values,
            workspaceId,
            image: values.image instanceof File ? values.image : "",
        }
        mutate({ form: finalValues }, {
            onSuccess: ({data}) => {
                form.reset();   
                router.push(`/workspaces/${workspaceId}/projects/${data.$id}`)
            }
        }); 
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(file){
            form.setValue("image", file)
        }
    };

    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    Create a new Project
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
                                        Project Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter Project Name"
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
                                            <p className="text-sm">Project Icon</p>
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
                                             { field.value ? 
                                             (
                                             <Button
                                                type="button"
                                                disabled={isPending}
                                                variant="destructive"
                                                className="w-fit mt-2 bg-blue-500"
                                                onClick={() => {
                                                    field.onChange(null);
                                                    if(inputRef.current){
                                                        inputRef.current.value = "";
                                                    }
                                                }}
                                             >Remove Image</Button>
                                             ):(
                                                <Button
                                                type="button"
                                                disabled={isPending}
                                                className="w-fit mt-2 bg-blue-500"
                                                onClick={() => inputRef.current?.click()}
                                             >Upload Image</Button>
                                             )
                                            }
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
                       
                    >Create Project</Button>
                    </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}