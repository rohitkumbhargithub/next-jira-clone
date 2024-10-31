"use client";

import { z } from "zod";
import { DottedSperator } from "@/components/dotted-speator"
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import Link from "next/link";
import { loginSchema } from "./schema";
import { useLogin } from "../api/use-login";


// const formSchema = z.object({
//     email: z.string().trim().min(1, "required").email(),
//     password: z.string().min(8, "Minimum 8 characters"),
// })


export const SignInCard = () => {
    const { mutate, isPending } = useLogin();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "", 
            password: "",

        }
    });

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        mutate({
            json: values
        });
    }
    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">Welcome Back!</CardTitle>
            </CardHeader>
            <div className="px-7 mb-2">
                <DottedSperator/>
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField 
                        name="email"    
                        control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                    <Input 
                        type="email"
                        {...field}
                        placeholder="Enter email address"
                    /> 
                
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                    )}/>
                    
                    <FormField 
                        name="password"    
                        control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                    <Input 
                        type="password"
                        {...field}
                        placeholder="Enter password"
                    /> 
                
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                    )}/>
                    <Button disabled={isPending} size="lg" className="w-full ">Login</Button>
                </form>
                </Form>
            </CardContent>
            <div className="px-7 mb-2">
                <DottedSperator/>
            </div>
            <CardContent className="p-7 flex flex-col gap-y-4">
                <Button variant="secondary" size="lg" disabled={isPending}>
                    <FcGoogle className="mr-2 size-5"/>
                    Login with Google 
                </Button>

                <Button variant="secondary" size="lg" disabled={isPending}>
                <FaGithub className="mr-2 size-5"/>
                    Login with GitHub 
                </Button>
            </CardContent>
            <div className="p-7 flex items-center justify-center">
                <p>Already have an account? </p>
                <Link href={"/sign-up"} className="text-blue-800 m-2"> Sign up</Link>
            </div>
        </Card>
    )
}