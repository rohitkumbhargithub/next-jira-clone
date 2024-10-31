"use client"
import Link from "next/link";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorPage = () => {
    return (
        <div className="h-screen flex flex-col gap-y-2 items-center justify-center">
            <AlertTriangle className="size-6 text-muted-foreground"/>
            <p className="text-sm text-muted-foreground">
                Something went wrong
            </p>
            <Button variant="outline" size="sm">
                <Link href="/">
                    Back to Home
                </Link>
            </Button>
        </div>
    )
}

export default ErrorPage;