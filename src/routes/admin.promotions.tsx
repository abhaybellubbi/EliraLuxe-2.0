import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/promotions")({
  component: () => <Navigate to="/admin" replace />,
});
