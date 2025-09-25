// 📂 app/admin/layout.tsx
"use client";

import ProtectedRoute from "@/components/ProtectedRoute";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute role="admin">
      <div className="min-h-screen flex flex-col bg-blue-50/50">

        <main className="flex-1 mt-20 px-6">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
