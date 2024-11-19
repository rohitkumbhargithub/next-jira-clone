"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import { OAuthProvider } from "node-appwrite";

export async function signUpWithGithub() {
	const { account } = await createAdminClient();

  const origin = headers().get("origin");
  
	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Github,
		`${origin}/oauth`,
		`${origin}/signup`,
	);

	return redirect(redirectUrl);
};


export async function signUpWithGoogle() {
	const { account } = await createAdminClient();

  const origin = headers().get("origin");
  
	const redirectUrl = await account.createOAuth2Token(
		OAuthProvider.Google,
		`${origin}/oauth`,
		`${origin}/signup`,
	);

	return redirect(redirectUrl);
};