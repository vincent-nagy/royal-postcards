"use client"

import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

interface SubNavbarProps {
    categories: string[];
    currentCategory: string;
    setCurrentCategory: Dispatch<SetStateAction<string>>;
}

export default function SubNavbar({
    categories, currentCategory, setCurrentCategory
}: SubNavbarProps) {
    return (
        <div className="sub-navbar">
            {categories?.map(category => (
                <div key={category}
                    onClick={() => setCurrentCategory(category)}
                    className="sub-navbar-item"
                    style={{ backgroundColor: currentCategory === category ? "#b30000" : "" }}
                >{category}</div>
            ))}
        </div>
    );
}