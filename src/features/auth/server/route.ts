import { ID } from "node-appwrite";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator"
import { loginSchema, registerSchema } from "../componets/schema";
import { deleteCookie, setCookie } from "hono/cookie";
import { createAdminClient } from "@/lib/appwrite";
import { AUTH_COOKIE } from "../constant";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono()
    .get("/current", sessionMiddleware, (c) => {
        const user = c.get("user");
  
        return c.json({ data: user })
    })
    .post("/login", 
        zValidator("json", loginSchema),
        // zValidator("param", z.object({ userId: z.number() })),
        async(c) => {
        const { email, password} = c.req.valid("json");
        // const { userId } = c.req.valid("param");
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(
            email,
            password
        )

        setCookie(c, AUTH_COOKIE, session.secret, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 60 * 60 * 24 * 30,
        });

        return c.json({ success: true }); 
    })
    .post("/register",
        zValidator("json", registerSchema),
        // zValidator("param", z.object({ userId: z.number() })),
        async(c) => {
        const { name, email, password} = c.req.valid("json");
        // const { userId } = c.req.valid("param");
        const { account } = await createAdminClient();
        await account.create(
            ID.unique(),
            email,
            password,
            name,
        )
        
        const session = await account.createEmailPasswordSession(
            email,
            password
        );

        setCookie(c, AUTH_COOKIE, session.secret, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 60 * 60 * 24 * 30,
        });
        
        return c.json({ success: true }); 
        }
    )
    .post("/logout", sessionMiddleware, async (c) => {
        const account = c.get("account");
        deleteCookie(c, AUTH_COOKIE);
        await account.deleteSession("current");
        return c.json({ success: true })
    })

export default app;