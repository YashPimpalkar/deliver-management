"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, getRole } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
  role?: "admin" | "partner";
}

export default function ProtectedRoute({ children, role }: Props) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const userRole = getRole();

    if (!token) {
      router.push("/login");
    } else if (role && userRole !== role) {
      router.push("/");
    }
  }, [router, role]);

  return <>{children}</>;
}
