"use client"

import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";

interface FormInputs {
    file: FileList
    country: string
    category: string
    subcategory: string
}

async function postItems(formData: FormData) {
    const response = await fetch('/api/admin/add', {
        method: "POST",
        body: formData,
    });

    const { result, errors } = await response.json();
    return { result, errors };
}

export default function Upload() {
    const [apiErrors, setApiErrors] = useState<string[]>([]);
    const [apiResult, setApiResult] = useState<Item[]>([]);
    const [apiLoading, setApiLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
    const onSubmit = async (fieldValues: FieldValues) => {
        setApiLoading(true);
        setApiErrors([]);
        setApiResult([]);

        const formData = new FormData();
        formData.append('folder', fieldValues.folder);
        formData.append('country', fieldValues.country);
        formData.append('category', fieldValues.category);
        formData.append('subcategory', fieldValues.subcategory);

        if (fieldValues.file && fieldValues.file instanceof FileList) {
            const files = fieldValues.file as FileList;
            for (let i = 0; i < files.length; i++) {
                formData.append(files[i].name, files[i]);
            }
        }

        const response = await fetch('/api/admin/add', {
            method: "POST",
            body: formData,
        }).then(res => res.json());

        const result = await response;
        console.log(result);
        console.log(result?.errors)

        if (result?.errors) {
            setApiErrors(result?.errors);
        }
        if (result?.items) {
            setApiResult(result?.items as Item[]);
        }
        setApiLoading(false);
    }

    return (<>
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='add-form'>
            <input type="file" multiple accept="image/*" {...register("file", { required: true })} />
            {errors.file && <span>File is required</span>}
            <input type="text" placeholder="Country" {...register("country", { required: true, maxLength: 50, minLength: 3 })} />
            {errors.country && <span>Country is required, min length 3, max length 50</span>}
            <input type="text" placeholder="Category" {...register("category", { required: true, maxLength: 50, minLength: 3 })} />
            {errors.category && <span>Category is required, min length 3, max length 50</span>}
            <input type="text" placeholder="Subcategory" {...register("subcategory", { required: false })} />
            <button disabled={apiLoading}>Save</button>
        </form>
        <div id="add-form-loading">
            {apiLoading && <p>Loading...</p>}
        </div>
        {apiErrors?.length > 0 && <div id="add-form-errors">
            <h3>Errors: </h3>
            {apiErrors && apiErrors?.map(error => <p key={error}>{error}</p>)}
        </div>}
        {apiResult?.length > 0 && <div id="add-form-result">
            <h3>Created items:</h3>
            <table>
                <thead>
                    <tr>
                        <th>Item ID</th>
                        <th>Source</th>
                        <th>Country</th>
                        <th>Category</th>
                        <th>Subcategory</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {apiResult?.map(item => <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.source}</td>
                        <td>{item.country}</td>
                        <td>{item.category}</td>
                        <td>{item.subcategory}</td>
                        <td><img src={"/images/" + item.source} style={{ width: "100px" }} /></td>
                    </tr>)}
                </tbody>
            </table>
        </div>}
    </>);
}