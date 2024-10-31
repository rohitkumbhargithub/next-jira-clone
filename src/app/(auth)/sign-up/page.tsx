import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { SignUpCard } from "@/features/auth/componets/sign-up-card";

const SignUpPage = async() => {
    const user = await getCurrent();

    if(user) redirect("/");
    return (
        <>
            <SignUpCard/>
        </>
    )
}

export default SignUpPage; 