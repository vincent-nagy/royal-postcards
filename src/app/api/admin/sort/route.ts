import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import clientPromise from "@/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(request: NextRequest) {
    console.log("PUT /api/admin/sort");

    const session = await auth();
    if (!session) {
        return NextResponse.json(null, { status: 401 })
    }
    if (request.body === null) {
        return NextResponse.json(null, { status: 400 })
    }

    const items: Item[] = await request.json();

    const client = await clientPromise;
    const db = client.db("Royal");


    const results = await Promise.all(items.map(item => {
        console.log("Updating item {} with order {}", item._id, item.order);
        return db.collection("Postcards").updateOne({ _id: new ObjectId(item._id) }, { $set: { order: item.order } });
    }));

    results.forEach(result => console.log("Result : ", result))

    return NextResponse.json(null, { status: 200 });
}