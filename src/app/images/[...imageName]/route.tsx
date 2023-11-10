import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import os from 'os';
import { auth } from "../../../../auth";

export async function GET(request: NextRequest, { params }: { params: { imageName: string[] } }) {
    const imagePath = params.imageName.join("/");

    const image = fs.readFileSync(`${os.homedir()}/images/${imagePath}`);

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

    const imageName = params.imageName[0];

    const data = await request.formData();
    const file: File | null = data.get('file') as File

    if (!file) {
        return NextResponse.json(null, { status: 400 })
    }

    fs.writeFile(`${os.homedir()}/images/${imageName}`, Buffer.from(await file.arrayBuffer()), { flag: 'wx' }, (err) => {
        return NextResponse.json({ message: err?.message }, { status: 400 })
    })

    return NextResponse.json({}, { status: 201 })
}