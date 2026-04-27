"use server";

import { adminDb, adminAuth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;
  try {
    const claims = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!claims.admin) {
        return null;
    }
    return claims;
  } catch (error) {
    return null;
  }
}

export async function getUsers() {
  const adminClaims = await verifyAdmin();
  if (!adminClaims) throw new Error("Unauthorized");

  const snapshot = await adminDb.collection("users").get();
  return snapshot.docs.map(doc => doc.data());
}

export async function banUser(uid: string) {
  const adminClaims = await verifyAdmin();
  if (!adminClaims) throw new Error("Unauthorized");

  await adminAuth.updateUser(uid, { disabled: true });
  await adminDb.collection("users").doc(uid).update({ status: "BANNED" });
  return { success: true };
}

export async function unbanUser(uid: string) {
    const adminClaims = await verifyAdmin();
    if (!adminClaims) throw new Error("Unauthorized");
  
    await adminAuth.updateUser(uid, { disabled: false });
    await adminDb.collection("users").doc(uid).update({ status: "ACTIVE" });
    return { success: true };
}

export async function getUserProfile(uid: string) {
  const user = await adminDb.collection("users").doc(uid).get();
  if (!user.exists) return null;
  return user.data();
}
