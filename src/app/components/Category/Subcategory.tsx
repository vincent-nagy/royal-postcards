"use client"

import ModalImage from "react-modal-image";
import useBaseWidthContext from "../../context/BaseWidth";

interface SubcategoryProps {
    items: Item[],
    title?: string
}

const Subcategory = ({ items, title }: SubcategoryProps) => {
    const { baseWidth } = useBaseWidthContext();

    return (<>
        <div className="subcategory">
            <h2>{title}</h2>
            <div className="items">
                {items?.map(item => (
                    <div className="item" key={item.id} style={{ width: item.layout === "horizontal" ? baseWidth * 2 + "%" : baseWidth + "%" }}>
                        <ModalImage
                            large={"/images/" + item.source}
                            small={"/images/" + item.source}
                            alt={item.description}
                            hideDownload={true}
                        />
                        <p>{item.description}</p>
                    </div>

                ))}
            </div>
        </div>
    </>);
}

export default Subcategory;