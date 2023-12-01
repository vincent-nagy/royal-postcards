import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../../auth";
import clientPromise from "@/mongodb";

import fs from "fs";
import os from "os";
import { ObjectId, WithId } from "mongodb";
import FsService from "@/app/services/FsService";


export async function DELETE(request: Request, { params }: { params: { itemId: string } }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json(null, { status: 401 })
    }
    if (request.body === null) {
        return NextResponse.json(null, { status: 400 })
    }

    const client = await clientPromise;
    const db = client.db("Royal");

    const item = await db.collection("Postcards").findOne({ _id: new ObjectId(params.itemId) });
    console.log("Before deleting found item : ", item);

    if (!item) {
        return NextResponse.json(null, { status: 404 });
    }

    fs.rmSync(`${os.homedir()}/images/${item.source}`, { recursive: true, force: true });

    const result = await db.collection("Postcards").deleteOne({ _id: new ObjectId(params.itemId) });

    if (result.acknowledged && result.deletedCount > 0) {
        return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(null, { status: 500 });
}

export async function PUT(request: NextRequest, { params }: { params: { itemId: string } }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json(null, { status: 401 })
    }
    if (request.body === null) {
        return NextResponse.json(null, { status: 400 })
    }

    const client = await clientPromise;
    const db = client.db("Royal");

    const json = await request.json();
    const { _id, ...withoutId } = json;

    const folder = json.subcategory ? `${json.country}/${json.category}/${json.subcategory}` : `${json.country}/${json.category}`;
    const source = `${folder}/${json.filename}`;

    withoutId.source = source;

    const result = await db.collection("Postcards").updateOne({ _id: new ObjectId(params.itemId) }, { $set: withoutId });
    console.log("Result : ", result);

    if (result.acknowledged && result.modifiedCount > 0) {
        FsService.moveFile(json.source, source);
        return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(null, { status: 500 });
}
