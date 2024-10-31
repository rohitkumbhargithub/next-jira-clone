import { useMediaQuery } from "react-responsive";

import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

import {
    Drawer,
    DrawerContent
} from "@/components/ui/drawer"
import React from "react";

interface ResponsiveModalProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ResponsiveModal = ({
    children,
    open,
    onOpenChange
}: ResponsiveModalProps) => {
    const isDesktop = useMediaQuery({ query: '(min-width: 1024px)' });


    if(isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh]">
                    {children}
                </DialogContent>
            </Dialog>
        )
    }else{
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <div className="overflow-y-auto hide-scrollbar max-h-[85vh]">
                    {children}
                </div>
            </DrawerContent>
            </Drawer>
        )
    }

}