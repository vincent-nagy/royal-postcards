export default abstract class ItemsApiService {
    public static async updateSort(items: Item[]): Promise<void> {
        try {
            const response = await fetch("/api/admin/sort", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(items),
            });
            if (!response.ok) {
                throw new Error("Failed to update sort");
            }
        } catch (error) {
            console.error(error);
        }
    }
}