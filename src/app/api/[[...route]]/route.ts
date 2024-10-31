import { Hono } from "hono";
import auth from "@/features/auth/server/route";
import workspaces from "@/app/features/workspaces/server/route";
import members from "@/app/features/members/server/route";
import projects from "@/app/features/projects/server/route";
import { handle } from "hono/vercel";


const app = new Hono().basePath("/api");


const routes = app
    .route("/auth", auth)
    .route("/members", members)
    .route("/workspaces", workspaces)
    .route("/projects", projects)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;