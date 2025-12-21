import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest){
    //1 . get the cokkies
    const userInfoCookie = request.cookies.get("userInfo");
    const userInfo = userInfoCookie? JSON.parse(userInfoCookie.value) : null;

    // 2. Protected Route 
    const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
    const isProfilePath = request.nextUrl.pathname.startsWith("/profile");



    // 3. Login in Redirect
    // Case 1: Not Loggin in , ntop user if not login
    if(!userInfo && (isAdminPath || isProfilePath)){
        return NextResponse.redirect(new URL("/login", request.url));
    
    }

    //Case B: login in
    if(userInfo && isAdminPath && userInfo.role !== "admin"){
        return NextResponse.redirect(new URL("/", request.url));
    }

    //Allow requeest top process
    return NextResponse.next();

}

// 4. Matcher
export const config = {
    matcher: ["/admin/:path*", "/profile/:path*"],
};

