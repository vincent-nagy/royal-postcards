import ZoomButtons from "@/app/components/ZoomButtons";
import CategoryHolder from "@/app/components/Category/CategoryHolder";
import ItemsService from "@/app/services/ItemsService";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { countryName: string } }) {
    const items = await ItemsService.fetchItems(params.countryName);
    const categories = [...new Set(items?.map(item => item.category))];

    return (<>
        <div className="country">
            <CategoryHolder items={items} categories={categories} />
            <ZoomButtons />
        </div >
    </>);
}