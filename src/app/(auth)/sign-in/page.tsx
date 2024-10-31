import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { SignInCard } from "@/features/auth/componets/sign-in-card";


const SignPage = async() => {
    const user = await getCurrent();

    if(user) redirect("/");

    return <SignInCard/>;
}

export default SignPage; 