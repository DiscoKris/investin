import "server-only";

import { doc, getDoc } from "firebase/firestore";
import { getFirebaseServerContext } from "./firebase-server";

function bearerToken(request: Request) {
  const authorization = request.headers.get("authorization");
  return authorization?.startsWith("Bearer ") ? authorization.slice(7) : null;
}

export async function isAdmin(context: NonNullable<Awaited<ReturnType<typeof getFirebaseServerContext>>>) {
  const admin = await getDoc(doc(context.db, "admins", context.user.uid)).catch(
    () => null,
  );
  return Boolean(
    admin?.exists() &&
      admin.data().active === true &&
      admin.data().role === "admin",
  );
}

export async function requireUserApi(request: Request) {
  const token = bearerToken(request);
  if (!token)
    return {
      error: Response.json({ error: "Please sign in again." }, { status: 401 }),
    };
  const context = await getFirebaseServerContext(token).catch(() => null);
  if (!context)
    return {
      error: Response.json({ error: "Please sign in again." }, { status: 401 }),
    };
  return context;
}
