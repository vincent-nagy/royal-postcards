"use client";

import ItemsApiService from "@/app/services/ItemsApiService";
import { useUpdateItemMutation } from "@/app/services/client/ItemsService";
import { ChangeEvent, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FiX } from "react-icons/fi";

interface FormInputs {
    country: string
    category: string
    subcategory: string
}

type UpdateItemModalProps = {
    item: Item | undefined;
    closeModal: () => void;
}

const UpdateItemModal = ({ item, closeModal }: UpdateItemModalProps) => {
    const [updateItem, { isLoading, }] = useUpdateItemMutation();

    const { register, reset, handleSubmit, formState: { errors } } = useForm<FormInputs>();
    useEffect(() => {
        reset(item)
    }, [item])

    const onSubmit = async (fieldValues: FieldValues) => {
        const modifiedItem = { ...item, ...fieldValues } as Item;
        console.log(modifiedItem);

        updateItem(modifiedItem)
            .unwrap()
            .then(() => {
                alert("Successfully updated item");
                closeModal();
            })
            .catch(() => {
                alert("Failed to update item");
            });
    }

    return (
        <>
            {item &&
                <div id="myModal" className="modal">
                    <div className="content">
                        <span className="close" onClick={closeModal}><FiX /></span>
                        <h2>Update item</h2>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className='form'>
                            <input type="text"
                                placeholder="Country"
                                {...register("country", { required: true, maxLength: 50, minLength: 3 })} />
                            {errors.country && <span>Country is required, min length 3, max length 50</span>}
                            <input type="text"
                                placeholder="Category"
                                {...register("category", { required: true, maxLength: 50, minLength: 3 })} />
                            {errors.category && <span>Category is required, min length 3, max length 50</span>}
                            <input type="text"
                                placeholder="Subcategory"
                                {...register("subcategory", { required: false })} />
                            <button className="save"
                                disabled={isLoading}>
                                Save
                            </button>
                        </form>
                    </div>
                </div>
            }
            <style jsx>{`
                .modal {
                    display: block;
                    position: fixed;
                    z-index: 1;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgb(0,0,0);
                    background-color: rgba(0,0,0,0.8);
                }

                .content {
                    background-color: #fefefe;
                    margin: 15% auto;
                    padding: 20px;
                    border: 1px solid #888;
                    width: 80%;
                    max-width: 500px;
                  }

                .close {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                }

                .close:hover, .close:focus {
                    color: black;
                    text-decoration: none;
                    cursor: pointer;
                }
                
                form {
                    display: flex;
                    flex-direction: column;
                }

                form *{
                    margin: 5px;
                }
                
                form span {
                    color: red;
                }
            `}</style>
        </>
    );
}

export default UpdateItemModal;