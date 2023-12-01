import Manage from "@/app/components/Admin/Manage";
import ItemsApiService from "@/app/services/ItemsApiService";

export const dynamic = "force-dynamic";

export default async function Page() {
    return (
        <>
            <Manage />
        </>
    )
}