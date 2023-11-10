import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";
import { auth } from "../../../../auth";

export async function GET(request: NextRequest, { params }: { params: { imageName: string[] } }) {
    const rootDir = path.parse(process.cwd()).root;
    const imagePath = params.imageName.join("/");

    const image = fs.readFileSync(`${rootDir}/home/vinagy/images/${imagePath}`);

    return new NextResponse(image, {
        status: 200,
        headers: {
            "Content-Type": "image/jpeg"
        }
    })
}

export async function PUT(request: NextRequest, { params }: { params: { imageName: string[] } }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json(null, { status: 401 })
    }

    const rootDir = path.parse(process.cwd()).root;
    const imageName = params.imageName[0];

    const data = await request.formData();
    const file: File | null = data.get('file') as File

    if (!file) {
        return NextResponse.json(null, { status: 400 })
    }

    fs.writeFile(`${rootDir}/home/vinagy/images/${imageName}`, Buffer.from(await file.arrayBuffer()), { flag: 'wx' }, (err) => {
        return NextResponse.json({ message: err?.message }, { status: 400 })
    })

    return NextResponse.json({}, { status: 201 })
}