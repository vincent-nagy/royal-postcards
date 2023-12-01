export default abstract class ItemsApiService {
    public static async updateSort(items: Item[]): Promise<boolean> {
        try {
            const response = await fetch("/api/admin/sort", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(items),
            });
            if (!response.ok) {
                return false;
            } else {
                return true;
            }
        } catch (error) {
            console.error(error);
        }
        return false;
    }
}