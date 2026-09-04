import { AdminDashboard } from "@/components/AdminDashboard";
import { getAdminData } from "@/lib/data";

export default async function AdminPage() {
  const data = await getAdminData();
  return <AdminDashboard initialApartments={data.apartments as any} leads={data.leads as any} />;
}
