import ProtectedRoute from "@/components/ProtectedRoute";

// This simplified layout wraps the partner dashboard pages.
export default function PartnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 mt-20 ">
      {/* Page content will be rendered here inside a main tag */}
      <ProtectedRoute role="partner">
        <main>{children}</main>
      </ProtectedRoute>
    </div>
  );
}
