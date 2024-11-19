import Image from "next/image"
import Link from "next/link"
import { Navigation } from "./navigation"
import { DottedSperator } from "./dotted-speator"
import { WorkspaceSwitcher } from "./workspace-swticher"
import Projects from "./projects"
import jiraLogo from "../app/utils/jira.svg";

export const Sidebar = () => {
    return (
        <aside className="h-[37rem] bg-neutral-100 p-4 w-full">
            <Link href="/">
              <Image src={jiraLogo} alt="jira logo" className="object-cover" />
            </Link>
            <DottedSperator className="my-4"/>
                <WorkspaceSwitcher/>
            <DottedSperator className="my-4"/>
            <Navigation/>
            <DottedSperator className="my-4"/>
            <Projects/>
        </aside>
    )
}
