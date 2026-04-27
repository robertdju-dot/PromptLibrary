import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    // Verify the ID token to get the user's email
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userEmail = decodedToken.email;
    const uid = decodedToken.uid;
    const isAdmin = userEmail && process.env.ADMIN_EMAIL && userEmail === process.env.ADMIN_EMAIL;

    // Check if they are the designated admin
    if (isAdmin) {
      // If they don't already have the admin claim, set it
      if (!decodedToken.admin) {
        await adminAuth.setCustomUserClaims(uid, { admin: true });
      }
    }

    // Sync user to Firestore
    const userRef = adminDb.collection("users").doc(uid);
    await userRef.set({
      id: uid,
      email: userEmail,
      name: decodedToken.name || userEmail?.split("@")[0] || "User",
      role: isAdmin ? "ADMIN" : "USER",
      tier: isAdmin ? "PREMIUM" : "FREE",
      status: "ACTIVE",
      lastLogin: new Date().toISOString(),
    }, { merge: true });

    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Create the session cookie
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set cookie using next/headers
    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error creating session cookie", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.json({ status: "success" }, { status: 200 });
}
