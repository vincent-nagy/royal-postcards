"use client"

import { useEffect, useState } from "react";
import Category from "./Category";
import SubNavbar from "../Nav/SubNavbar";

interface CategoryHolderProps {
    items: Item[],
    categories: string[]
}
const CategoryHolder = ({ items, categories }: CategoryHolderProps) => {
    const [currentCategory, setCurrentCategory] = useState(categories[0]);

    useEffect(() => {
        const handleContextmenu = (e: MouseEvent) => {
            e.preventDefault()
        }
        document.addEventListener('contextmenu', handleContextmenu)
        return function cleanup() {
            document.removeEventListener('contextmenu', handleContextmenu)
        }
    }, [])


    return (<>
        <SubNavbar categories={categories} currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} />
        <Category items={items?.filter(item => item.category === currentCategory)} categoryName={currentCategory} />
    </>);
}

export default CategoryHolder;