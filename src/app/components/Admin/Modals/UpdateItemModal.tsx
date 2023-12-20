"use client";

import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import Modal from "./Modal";
import ItemsService from "@/app/services/client/ItemsService";

interface FormInputs {
    country: string
    category: string
    subcategory: string
}

type UpdateItemModalProps = {
    item: Item | undefined;
    closeModal: () => void;
    isOpen: boolean;
}

const UpdateItemModal = ({ item, closeModal, isOpen }: UpdateItemModalProps) => {
    const useUpdateItem = ItemsService.useUpdateItem();

    const { register, reset, handleSubmit, formState: { errors } } = useForm<FormInputs>();
    useEffect(() => {
        reset(item)
    }, [item])

    const onSubmit = async (fieldValues: FieldValues) => {
        const modifiedItem = { ...item, ...fieldValues } as Item;

        useUpdateItem.mutate(modifiedItem, {
            onSuccess: () => {
                alert("Successfully updated item");
                closeModal();
            },
            onError: () => {
                alert("Failed to update item");
            }
        })
    }

    return (
        <>
            {item &&
                <Modal closeModal={closeModal} isOpen={isOpen}>
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
                            disabled={useUpdateItem.isPending}>
                            Save
                        </button>
                    </form>
                </Modal>
            }
            <style jsx>{`
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

                .save {
                    margin: 5px;
                    width: 98%;
                }
            `}</style>
        </>
    );
}

export default UpdateItemModal;