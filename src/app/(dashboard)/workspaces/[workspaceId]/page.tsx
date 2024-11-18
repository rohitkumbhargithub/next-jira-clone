import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import WorkspaceIdClient from "./client";


const WorkspaceIdpage = async () => {
    const user = await getCurrent();

    if(!user) redirect("/sign-in");

    return <WorkspaceIdClient />
}

export default WorkspaceIdpage;