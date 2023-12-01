"use client"

import { useEffect, useState } from "react";
import Category from "./Category";
import SubNavbar from "../Nav/SubNavbar";
import { useFetchItemsQuery } from "@/app/services/client/ItemsService";

interface CategoryHolderProps {
    country: string,

}
const CategoryHolder = ({ country }: CategoryHolderProps) => {
    const { items } = useFetchItemsQuery(undefined, {
        selectFromResult: ({ data }) => ({
            items: data?.filter(item => item.country === country)
        }),
    });

    const categories = [...new Set(items?.map(item => item.category))];
    console.log("ITEMS::", items);
    console.log("CATEGORIES::", categories);

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