import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import path from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import clientPromise from "@/mongodb";
import sizeOf from "image-size";

const rootDir = path.parse(process.cwd()).root;

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json(null, { status: 401 })
    }

    const formData = await request.formData();

    const country = formData.get("country")?.toString().trim().replace(/[^a-zA-Z0-9 ]/g, '')
    const category = formData.get("category")?.toString().trim().replace(/[^a-zA-Z0-9 ]/g, '')
    const subcategory = formData.get("subcategory")?.toString().trim().replace(/[^a-zA-Z0-9 ]/g, '')

    const folder = subcategory ? `${country}/${category}/${subcategory}` : `${country}/${category}`;

    createFolderIfNotExists(folder);

    const files = [...formData.values()]
        .filter(value => typeof value === "object" && "arrayBuffer" in value)
        .map(value => value as unknown as File);

    let errors: string[] = [];
    await writeFiles(files, folder, errors);



    const items: Item[] = files.filter(file => !errors.find(error => {
        return error.includes(file.name)
    })).map((file) => {
        const size = sizeOf(`${rootDir}home/vinagy/images/${folder}/${file.name}`);
        return ({
            source: `${folder}/${file.name}`,
            filename: file.name,
            country: country,
            category: category,
            subcategory: subcategory,
            layout: size.height && size.width ? (size.height > size.width ? "horizontal" : "vertical") : "horizontal",
        } as Item)
    });

    const client = await clientPromise;
    const db = client.db("Royal");

    let savedItems = [];
    await Promise.all(items.map(async (item) => {
        try {
            const result = await db.collection("Postcards").insertOne(item);
            if (result.acknowledged) {
                item.id = result.insertedId.toString();
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

function createFolderIfNotExists(folder: string) {
    if (!existsSync(`${rootDir}home/vinagy/images/${folder}`)) {
        mkdirSync(`${rootDir}home/vinagy/images/${folder}`, { recursive: true });
    }
}

function writeFiles(files: File[], folder: string, errors: string[]): Promise<void[]> {
    return Promise.all(files.map(async file => {
        try {
            writeFileSync(`${rootDir}home/vinagy/images/${folder}/${file.name}`, Buffer.from(await file.arrayBuffer()), { flag: 'wx' });
        } catch (err) {
            if (err instanceof Error) {
                errors.push(err?.message as string);
            } else {
                errors.push(err as string);
            }
        }
    }));
}