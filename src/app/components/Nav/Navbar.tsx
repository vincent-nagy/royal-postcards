import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { auth } from "../../../../auth";
import clientPromise from "@/mongodb";

const Navbar = async () => {
    const session = await auth();

    const client = await clientPromise;
    const db = client.db("Royal");

    const countries = (await db.collection("Postcards").distinct("country")).map((country: string) => {
        return country as string;
    });

    return (
        <header className="navbar">
            <h1>Royal postcards</h1>
            <nav>
                <Link href="/">Home</Link>
                {countries && countries.map((country: string) => (
                    <Link key={country} href={`/countries/${country}`}>{country}</Link>
                ))}
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                {session && <Link href="/admin/images" style={{ float: "right" }}>Add images</Link>}
                {!session && <Link href="/api/auth/signin" style={{ float: "right" }}>Sign in</Link>}
            </nav>
        </header>
    );
}

export default Navbar;