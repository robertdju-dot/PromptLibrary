"use server";

import { adminDb } from "@/lib/firebase-admin";
import { Prompt } from "@/lib/mockData";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

async function verifySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;
  try {
    return await adminAuth.verifySessionCookie(sessionCookie, true);
  } catch (error) {
    return null;
  }
}

export async function createPrompt(data: { title: string; description: string; content: string; tags: string[]; isPublic: boolean; isMemberOnly?: boolean }) {
  const decodedClaims = await verifySession();
  if (!decodedClaims) throw new Error("Unauthorized");

  const uid = decodedClaims.uid;

  if (data.isMemberOnly && !decodedClaims.admin) {
    throw new Error("Unauthorized: Only admins can create member prompts");
  }

  // Enforce limits for free users (skip check for admins)
  if (!decodedClaims.admin) {
    const userDoc = await adminDb.collection("users").doc(uid).get();
    const userData = userDoc.data();
    
    if (userData?.tier !== "PREMIUM") {
      const currentPrompts = await adminDb.collection("prompts").where("userId", "==", uid).count().get();
      if (currentPrompts.data().count >= 10) {
        throw new Error("PROMPT_LIMIT_REACHED");
      }
    }
  }

  const promptRef = adminDb.collection("prompts").doc();
  const newPrompt = {
    id: promptRef.id,
    userId: decodedClaims.uid,
    title: data.title,
    description: data.description,
    content: data.content,
    tags: data.tags.map(name => ({ id: name, name })), // Store tags inline
    isPublic: data.isPublic,
    isMemberOnly: data.isMemberOnly || false,
    createdAt: new Date().toISOString(),
  };

  await promptRef.set(newPrompt);
  revalidatePath("/dashboard");
  if (data.isMemberOnly) {
    revalidatePath("/dashboard/member-prompts");
  }
  return { success: true, prompt: newPrompt };
}

export async function getPrompts(userId: string) {
  const snapshot = await adminDb.collection("prompts").where("userId", "==", userId).get();
  return snapshot.docs.map(doc => doc.data() as Prompt);
}



export async function getAllPrompts() {
  const decodedClaims = await verifySession();
  if (!decodedClaims || !decodedClaims.admin) {
    throw new Error("Unauthorized");
  }
  const snapshot = await adminDb.collection("prompts").get();
  return snapshot.docs.map(doc => doc.data() as Prompt);
}

export async function deletePrompt(id: string) {
  const decodedClaims = await verifySession();
  if (!decodedClaims) throw new Error("Unauthorized");

  const promptRef = adminDb.collection("prompts").doc(id);
  const prompt = await promptRef.get();
  
  if (!prompt.exists) {
    throw new Error("Not found");
  }

  // Allow admin OR the original author to delete
  if (!decodedClaims.admin && prompt.data()?.userId !== decodedClaims.uid) {
    throw new Error("Unauthorized");
  }

  await promptRef.delete();
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getPromptById(id: string) {
  const prompt = await adminDb.collection("prompts").doc(id).get();
  if (!prompt.exists) return null;
  return prompt.data() as Prompt;
}

export async function updatePrompt(id: string, data: { title: string; description: string; content: string; tags: string[]; isPublic: boolean; isMemberOnly?: boolean }) {
  const decodedClaims = await verifySession();
  if (!decodedClaims) throw new Error("Unauthorized");

  const promptRef = adminDb.collection("prompts").doc(id);
  const prompt = await promptRef.get();

  if (!prompt.exists) {
    throw new Error("Not found");
  }

  // Allow admin OR the original author to update
  if (!decodedClaims.admin && prompt.data()?.userId !== decodedClaims.uid) {
    throw new Error("Unauthorized");
  }

  // Only admins can set isMemberOnly
  if (data.isMemberOnly && !decodedClaims.admin) {
    throw new Error("Unauthorized: Only admins can create member prompts");
  }

  const updatedData: any = {
    title: data.title,
    description: data.description,
    content: data.content,
    tags: data.tags.map(name => ({ id: name, name })),
    isPublic: data.isPublic,
    updatedAt: new Date().toISOString(),
  };

  if (decodedClaims.admin) {
    updatedData.isMemberOnly = data.isMemberOnly || false;
  }

  await promptRef.update(updatedData);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/member-prompts");
  return { success: true };
}

export async function getMemberPrompts() {
  const decodedClaims = await verifySession();
  if (!decodedClaims) throw new Error("Unauthorized");

  const snapshot = await adminDb.collection("prompts").where("isMemberOnly", "==", true).get();
  return snapshot.docs.map(doc => doc.data() as Prompt);
}

export async function uploadMemberPrompts(promptsData: { title: string; description: string; content: string; tags: string[] }[]) {
  const decodedClaims = await verifySession();
  if (!decodedClaims || !decodedClaims.admin) throw new Error("Unauthorized");

  const batch = adminDb.batch();
  
  promptsData.forEach(data => {
    const promptRef = adminDb.collection("prompts").doc();
    const newPrompt = {
      id: promptRef.id,
      userId: decodedClaims.uid,
      title: data.title,
      description: data.description,
      content: data.content,
      tags: data.tags.map(name => ({ id: name, name })),
      isPublic: false,
      isMemberOnly: true,
      createdAt: new Date().toISOString(),
    };
    batch.set(promptRef, newPrompt);
  });

  await batch.commit();
  revalidatePath("/dashboard/member-prompts");
  return { success: true, count: promptsData.length };
}
