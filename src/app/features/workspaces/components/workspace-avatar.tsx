import Image from "next/image";

import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface WorksapceAvatarProps {
    image?: string;
    name?: string;
    classname?: string;
};

export const WorkspaceAvatar = ({
    image,
    name,
    classname
}: WorksapceAvatarProps) => {
    if(image){
        return (
            <div className={cn(
                "size-10 relative rounded-md overflow-hidden",
                classname
            )}>
                <Image src={image} alt={name} fill className="object-cover" />
            </div>
        )
    }
    
    return (
        <Avatar className={cn("size-10 rounded-md", classname)}>
            <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg uppercase">
                {name[0]}
            </AvatarFallback>
        </Avatar>
    )
}