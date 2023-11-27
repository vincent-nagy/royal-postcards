import clientPromise from "@/mongodb";
import { Document, WithId } from "mongodb";

export default abstract class ItemsService {
    public static async fetchItems(countryName: string): Promise<Item[]> {
        const client = await clientPromise;
        const db = client.db("Royal");

        const items: Item[] = (await db.collection("Postcards").find({ country: countryName }).toArray())
            .map(this.mapDocToItem);
        return items;
    }

    public static async fetchAllItems(): Promise<Item[]> {
        const client = await clientPromise;
        const db = client.db("Royal");

        const items: Item[] = (await db.collection("Postcards").find().toArray())
            .map(this.mapDocToItem);
        return items;
    }

    private static mapDocToItem(doc: WithId<Document>): Item {
        return {
            id: doc._id.toString(),
            filename: doc.filename,
            country: doc.country,
            category: doc.category,
            subcategory: doc.subcategory,
            source: doc.source,
            description: doc.description,
            layout: doc.layout,
            order: doc.order
        }
    }
}
