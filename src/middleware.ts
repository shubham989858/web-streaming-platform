import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isApiRoute = createRouteMatcher([
    "/api(.*)",
])

const isAuthRoute = createRouteMatcher([
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/sso-callback(.*)",
    "/reset-password(.*)",
    "/forgot-password(.*)",
])

const isProtectedRoute = createRouteMatcher([
    "/protected(.*)",
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()

    const isSignedIn = !!userId

    if (isApiRoute(req)) {
        return NextResponse.next()
    }

    if (isAuthRoute(req) && isSignedIn) {
        return NextResponse.redirect(new URL("/", req.nextUrl))
    }

    if (isProtectedRoute(req) && !isSignedIn) {
        return NextResponse.redirect(new URL("/sign-in", req.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
}