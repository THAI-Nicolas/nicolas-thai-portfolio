import { defineMiddleware } from "astro:middleware";
import PocketBase from "pocketbase";

export const onRequest = defineMiddleware(async (context, next) => {
  // Protection des routes /admin/* sauf /admin/login
  if (
    context.url.pathname.startsWith("/admin") &&
    context.url.pathname !== "/admin/login"
  ) {
    const authCookie = context.cookies.get("pb_auth");

    if (!authCookie) {
      return context.redirect("/admin/login");
    }

    try {
      const authData = JSON.parse(authCookie.value);
      const pb = new PocketBase("http://127.0.0.1:8090");
      pb.authStore.save(authData.token, authData.model);

      // Vérifier si le token est toujours valide
      if (!pb.authStore.isValid) {
        context.cookies.delete("pb_auth", { path: "/" });
        return context.redirect("/admin/login");
      }

      // Stocker l'utilisateur dans les locals pour y accéder dans les pages
      context.locals.user = pb.authStore.model;
      context.locals.pb = pb;
    } catch (error) {
      console.error("Erreur auth middleware:", error);
      context.cookies.delete("pb_auth", { path: "/" });
      return context.redirect("/admin/login");
    }
  }

  const response = await next();

  // Ajouter headers de performance pour toutes les réponses
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Feature Policy pour bloquer les fonctionnalités inutiles dans les iframes
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
});
