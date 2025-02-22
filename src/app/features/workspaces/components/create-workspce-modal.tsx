"use client"


import { ResponsiveModal } from "@/components/responsive-model";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

export const CreateWorkspaceModal = () => {
    const { isOpen, close} = useCreateWorkspaceModal();


    return (
        <ResponsiveModal open={isOpen} onOpenChange={() => {}}>
            <CreateWorkspaceForm onCancel={close}/>
        </ResponsiveModal>
    )
}