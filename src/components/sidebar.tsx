// import Image from "next/image"
import Link from "next/link"
import { Navigation } from "./navigation"
import { DottedSperator } from "./dotted-speator"
import { WorkspaceSwitcher } from "./workspace-swticher"
import Projects from "./projects"

export const Sidebar = () => {
    return (
        <aside className="h-[37rem] bg-neutral-100 p-4 w-full">
            <Link href="/">
                {/* <Image src="https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg" alt="logo" width={164} height={48} /> */}
                <h1>LOGO</h1>
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
