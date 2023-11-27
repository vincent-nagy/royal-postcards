import Manage from "@/app/components/Admin/Manage";
import ItemsService from "@/app/services/ItemsService";

export const dynamic = "force-dynamic";

export default async function Page() {
    const items = await ItemsService.fetchAllItems();

    return (
        <>
            <Manage items={items} />
        </>
    )
}