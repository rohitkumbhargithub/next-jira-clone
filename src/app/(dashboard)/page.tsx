
import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

import { getWorkspaces } from "../features/workspaces/server/queries";


export default async function Home() {
  const user = await getCurrent();

  if(!user) redirect("/sign-in");

  const worksapces = await getWorkspaces();
  if(worksapces.total === 0){
    redirect("/workspaces/create")
  }else{
    redirect(`/workspaces/${worksapces.documents[0].$id}`)
  }
}
