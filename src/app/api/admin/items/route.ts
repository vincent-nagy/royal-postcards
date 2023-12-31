import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import os from "os";
import clientPromise from "@/mongodb";
import sizeOf from "image-size";
import FsService from "@/app/services/FsService";
import { Db, WithId } from "mongodb";


export async function GET(request: NextRequest) {
    const client = await clientPromise;
    const db = client.db("Royal");

    const items: Item[] = (await db.collection<Item>("Postcards").find()
        .map(mapItem)
        .toArray());

    return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json(null, { status: 401 })
    }
    const client = await clientPromise;
    const db = client.db("Royal");

    const formData = await request.formData();

    const country = formData.get("country")?.toString().trim().replace(/[^a-zA-Z0-9 ]/g, '')
    const category = formData.get("category")?.toString().trim().replace(/[^a-zA-Z0-9 ]/g, '')
    const subcategory = formData.get("subcategory")?.toString().trim().replace(/[^a-zA-Z0-9 ]/g, '')

    const folder = subcategory ? `${country}/${category}/${subcategory}` : `${country}/${category}`;

    FsService.createFolderIfNotExists(folder);

    const files = [...formData.values()]
        .filter(value => typeof value === "object" && "arrayBuffer" in value)
        .map(value => value as unknown as File);

    let errors: string[] = [];
    await FsService.writeFiles(files, folder, errors);


    const subcategoryOrder = (await db.collection("Postcards").findOne({ country, category, subcategory }))?.subcategoryOrder;

    const items: Item[] = files.filter(file => !errors.find(error => {
        return error.includes(file.name)
    })).map((file) => {
        const size = sizeOf(`${os.homedir()}/images/${folder}/${file.name}`);
        console.log("Size :", size.height, size.width);
        console.log("Layout :", size.height && size.width ? (size.height < size.width ? "horizontal" : "vertical") : "horizontal");
        return ({
            source: `${folder}/${file.name}`,
            filename: file.name,
            country: country,
            category: category,
            subcategory: subcategory,
            subcategoryOrder: subcategoryOrder,
            layout: size.height && size.width ? (size.height < size.width ? "horizontal" : "vertical") : "horizontal",
        } as Item)
    });



    let savedItems = [];
    await Promise.all(items.map(async (item) => {
        try {
            const result = await db.collection<Item>("Postcards").insertOne(item);
            if (result.acknowledged) {
                item._id = result.insertedId.toString();
                return item;
            }
        } catch (err) {
            errors.push(err as string);
        }
    })).then(results => {
        results.forEach(result => {
            console.log("Result: " + JSON.stringify(result));
            savedItems.push(result);
        })
    })

    if (errors.length > 0 && savedItems.length <= 0) {
        return NextResponse.json({ errors: errors }, { status: 400 })
    }

    return NextResponse.json({ items: items, errors: errors }, { status: 201 })
}

function mapItem(doc: WithId<Item>): Item {
    return {
        ...doc,
        _id: doc._id.toString(),
    };
}
