"use client"

import { useEffect, useState } from "react";
import Category from "./Category";
import SubNavbar from "../Nav/SubNavbar";
import { useGetItemsByCountry } from "@/app/services/client/ItemsService";

interface CategoryHolderProps {
    country: string,

}
const CategoryHolder = ({ country }: CategoryHolderProps) => {
    const { data: items } = useGetItemsByCountry(country);

    const categories = [...new Set(items?.map(item => item.category))];

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
        {items && categories &&
            <>
                <SubNavbar categories={categories} currentCategory={currentCategory} setCurrentCategory={setCurrentCategory} />
                <Category items={items?.filter(item => item.category === currentCategory)} categoryName={currentCategory} />
            </>
        }
    </>);
}

export default CategoryHolder;