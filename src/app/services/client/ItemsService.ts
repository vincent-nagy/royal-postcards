"use client";
import { UseMutationResult, UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export function useItemsQuery(select: (data: Item[]) => Item[]): UseQueryResult<Item[], Error> {
    const getItems = async () => {
        const response = await fetch('/api/admin/items');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json() as Promise<Item[]>;
    }

    return useQuery({
        queryKey: ['items'],
        queryFn: getItems,
        select,
        staleTime: 1000 * 60 * 10,
    });
}

export function useGetItems(): UseQueryResult<Item[], Error> {
    return useItemsQuery(items => items);
}

export function useGetItemsByCountry(country: string) {
    return useItemsQuery(items => items.filter((item) => item.country === country));
}

export function useGetItemsByCountryCategory(country: string, category: string) {
    return useItemsQuery(items => items.filter((item) => item.country === country && item.category === category));
}

export function useGetItemsByCountryCategorySubcategory(country: string, category: string, subcategory: string) {
    return useItemsQuery(items => items.filter((item) => item.country === country && item.category === category && item.subcategory === subcategory));
}

export function useDeleteItem(): UseMutationResult<void, Error, string, unknown> {
    const queryClient = useQueryClient();

    const deleteItem = async (id: string) => {
        const response = await fetch(`/api/admin/items/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    }

    return useMutation({
        mutationFn: (id: string) => deleteItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        }
    });
}

export function useUpdateItem(): UseMutationResult<void, Error, Item, unknown> {
    const queryClient = useQueryClient();

    const updateItem = async (item: Item) => {
        const response = await fetch(`/api/admin/items/${item._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    }

    return useMutation({
        mutationFn: (item: Item) => updateItem(item),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items'] });
        }
    })
}
