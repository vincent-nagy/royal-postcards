"use client";

import ModalImage from "react-modal-image";

type ItemImageProps = {
    item: Item,
    baseWidth: number
}

const ItemImage = ({ item, baseWidth }: ItemImageProps) => {
    return (
        <>
            <div className="item" key={item._id} style={{ width: item.layout === "horizontal" ? baseWidth * 2 + "%" : baseWidth + "%" }} itemID={item._id}>
                <ModalImage
                    large={"/images/" + item.source}
                    small={"/images/" + item.source}
                    alt={item.filename}
                    hideDownload={true}
                    draggable={false}
                />
            </div>
        </>
    );
}

export default ItemImage;