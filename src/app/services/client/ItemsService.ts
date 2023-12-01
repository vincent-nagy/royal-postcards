import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const itemsApi = createApi({
    reducerPath: 'itemsApi',
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_BASE_URL }),
    tagTypes: ['Items'],
    endpoints: (builder) => ({
        fetchItems: builder.query<Item[], void>({
            query: () => 'api/admin/items',
            providesTags: ['Items'],
        }),
        updateItem: builder.mutation<void, Item>({
            query: (item) => ({
                url: `api/admin/items/${item._id}`,
                method: 'PUT',
                body: item,
            }),
            invalidatesTags: ['Items'],
        }),
        deleteItem: builder.mutation<void, string>({
            query: (id) => ({
                url: `api/admin/items/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Items'],
        })
    })

})

export const { useFetchItemsQuery, useUpdateItemMutation, useDeleteItemMutation } = itemsApi;