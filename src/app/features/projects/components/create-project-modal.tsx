"use client";

import { ResponsiveModal } from "@/components/responsive-model";
import { CreateProjectForm } from "./create-project-form";
import { useCreateProjectsModal } from "../hooks/use-create-projects-modal";
export const CreateProjectModal = () => {
    const { isOpen, close} = useCreateProjectsModal();


    return (
        <ResponsiveModal open={isOpen} onOpenChange={() => {}}>
            <CreateProjectForm onCancel={close}/>
        </ResponsiveModal>
    )
}