import { z } from "zod";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { getMember } from "../utils";
import { MemberRole } from "../types";

const app = new Hono()
        .get(
            "/",
            sessionMiddleware,
            zValidator("query", z.object({ workspaceId: z.string() })),
            async (c) => {
                const { users } = await createAdminClient();
                const databases = c.get("database");
                const user = c.get("user");
                const { workspaceId } = c.req.valid("query");

                const member = await getMember({
                    databases,
                    workspaceId,
                    userId: user.$id,
                })

                if(!member){
                    return c.json({ error: "UnAuthorized!"}, 401);
                }

                const members = await databases.listDocuments(
                    DATABASE_ID,
                    MEMBERS_ID,
                    [Query.equal("workspaceId", workspaceId)]
                );

                const poplutedMemebers = await Promise.all(
                    members.documents.map(async (member) => {
                        const user = await users.get(member.userId);

                        return {
                            ...member,
                            name: user.name,
                            email: user.email
                        }
                    })
                );

                return c.json({
                    data: {
                        ...members,
                        documents: poplutedMemebers,
                    }
                });
            }
        ).delete(
            "/:memberId",
            sessionMiddleware,
            async (c) => {
                const { memberId } = c.req.param();
                const user = c.get("user");
                const databases = c.get("database");

                const memberToDelete = await databases.getDocument(
                    DATABASE_ID,
                    MEMBERS_ID,
                    memberId,
                );

                const allMembersInWorkspace = await databases.listDocuments(
                    DATABASE_ID,
                    MEMBERS_ID,
                    [Query.equal("workspaceId", memberToDelete.workspaceId)]
                );

                const member = await getMember({
                    databases,
                    workspaceId: memberToDelete.workspaceId,
                    userId: user.$id
                });

                if(!member){
                    return c.json({ error: "UnAuthorized!" }, 401);
                }

                if(member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN){
                    return c.json({ error: "UnAuthorized!" }, 401);
                }

                if(allMembersInWorkspace.total === 1){
                    return c.json({ error: "can't delete the only member!" }, 400);
                }

                await databases.deleteDocument(
                    DATABASE_ID,
                    MEMBERS_ID,
                    memberId,
                )

                return c.json({ data: { $id: memberToDelete.$id} });
            }
        ).patch(
            "/:memberId",
            sessionMiddleware,
            zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
            async (c) => {
                const { memberId } = c.req.param();
                const { role } = c.req.valid("json");
                const user = c.get("user");
                const databases = c.get("database");

                const memberToUpdate = await databases.getDocument(
                    DATABASE_ID,
                    MEMBERS_ID,
                    memberId,
                );

                const allMembersInWorkspace = await databases.listDocuments(
                    DATABASE_ID,
                    MEMBERS_ID,
                    [Query.equal("workspaceId", memberToUpdate.workspaceId)]
                );

                const member = await getMember({
                    databases,
                    workspaceId: memberToUpdate.workspaceId,
                    userId: user.$id
                });

                if(!member){
                    return c.json({ error: "UnAuthorized!" }, 401);
                }

                if(member.$id !== MemberRole.ADMIN){
                    return c.json({ error: "UnAuthorized!" }, 401);
                }

                if(allMembersInWorkspace.total === 1){
                    return c.json({ error: "can't downgrade the only member!" }, 400);
                }

                await databases.updateDocument(
                    DATABASE_ID,
                    MEMBERS_ID,
                    memberId,
                    {
                        role,
                    }
                )

                return c.json({ data: { $id: memberToUpdate.$id} });
            }
        )

export default app;
