"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export default function AutoLogoutHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isPublicPage =
    pathname === "/login" ||
    pathname === "/chat/login" ||
    pathname === "/admin/login" ||
    pathname === "/super-admin/login" ||
    pathname === "/superadmin/login" ||
    pathname === "/register" ||
    pathname === "/unauthorized" ||
    pathname?.startsWith("/forms/");

  const performLogout = async () => {
    let role: 'superadmin' | 'admin' | 'user' = 'user';
    if (pathname?.startsWith("/super-admin") || pathname?.startsWith("/superadmin")) {
      role = 'superadmin';
    } else if (pathname?.startsWith("/admin")) {
      role = 'admin';
    }

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
    } catch (e) {
      console.error("Auto logout error:", e);
    }

    if (role === 'superadmin') {
      router.push("/super-admin/login?reason=session_expired");
    } else if (role === 'admin') {
      router.push("/admin/login?reason=session_expired");
    } else {
      router.push("/login?reason=session_expired");
    }
    router.refresh();
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (!isPublicPage) {
      timerRef.current = setTimeout(performLogout, INACTIVITY_TIMEOUT_MS);
    }
  };

  useEffect(() => {
    if (isPublicPage) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Set initial 30-minute timer
    resetTimer();

    // Event listeners for user activity
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    const handleActivity = () => resetTimer();

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [pathname, isPublicPage]);

  return null;
}
