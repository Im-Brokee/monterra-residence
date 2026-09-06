import { AdminDashboard } from "@/components/AdminDashboard";
import { getAdminData } from "@/lib/data";

export default async function AdminPage() {
  const data = await getAdminData();
  return <AdminDashboard
    projectId={data.projectId}
    initialApartments={data.apartments as any}
    initialLeads={data.leads}
    initialInventory={data.inventory}
    initialAddons={data.addons}
    priceHistory={data.priceHistory}
    initialConstruction={data.construction}
  />;
}
