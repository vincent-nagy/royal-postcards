type Item = {
    _id: string,
    filename: string,
    country: string,
    category: string,
    subcategory: string,
    source: string,
    description: string,
    layout: "vertical" | "horizontal",
    order?: number
}