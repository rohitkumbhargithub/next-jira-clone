"use client";

import { z } from 'zod';
import { DottedSperator } from "@/components/dotted-speator"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { registerSchema } from './schema';
import { useRegister } from '../api/use-register';


// const formSchema = z.object({
//     email: z.string().trim().min(1, "required").email(),
//     password: z.string().min(8, "Minimum 8 characters"),
//     cpassword: z.string().min(8, "Minimum 8 characters"),
// })

export const SignUpCard = () => {
    const { mutate, isPending } = useRegister()
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",

        }
    });

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        mutate({ json: values});
    }

    return (
        <Card className="w-full h-full md:w-[487px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">Sign Up</CardTitle>
                <CardDescription>This is demo</CardDescription>
            </CardHeader>
            <div className="px-7 mb-2">
                <DottedSperator/>
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                <FormField 
                        name="name"    
                        control={form.control}
                    render={({ field }) => (
                    <FormItem>
                        <FormControl>
                    <Input 
                        type="name"
                        {...field}
                        placeholder="Enter name"
                    /> 
                
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                    )}/>

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
                    <Button disabled={isPending} size="lg" className="w-full ">Register</Button>
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
                <p>Not a memeber? </p>
                <Link href={"/sign-in"} className="text-blue-800 m-2"> Sign in</Link>
            </div>
        </Card>
    )
}