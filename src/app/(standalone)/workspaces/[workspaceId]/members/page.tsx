import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { MemeberList } from "@/app/features/workspaces/components/members-list";

const WorkspaceIdMemeberPage = async () => {
    const user = getCurrent();
    if(!user) redirect("/sign-in");
    return (
        <div className="w-full lg:max-w-xl">
            <MemeberList/>
        </div>
    )
}

export default WorkspaceIdMemeberPage;