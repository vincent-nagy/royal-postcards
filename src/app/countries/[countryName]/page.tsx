import ZoomButtons from "@/app/components/ZoomButtons";
import CategoryHolder from "@/app/components/Category/CategoryHolder";
import clientPromise from "@/mongodb";


export async function fetchItems(countryName: string): Promise<Item[]> {
    const client = await clientPromise;
    const db = client.db("Royal");

    const items: Item[] = (await db.collection("Postcards").find({ country: countryName }).toArray()).map(doc => {
        return {
            id: doc._id.toString(),
            filename: doc.filename,
            country: doc.country,
            category: doc.category,
            subcategory: doc.subcategory,
            source: doc.source,
            description: doc.description,
            layout: doc.layout
        }
    });
    return items;
}

export default async function Page({ params }: { params: { countryName: string } }) {
    const items = await fetchItems(params.countryName);
    const categories = [...new Set(items?.map(item => item.category))];

    return (<>
        <div className="country">
            <CategoryHolder items={items} categories={categories} />
            <ZoomButtons />
        </div >
    </>);
}