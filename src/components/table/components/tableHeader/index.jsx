import React, { useCallback, useState } from "react";
import styles from "./index.module.css";
import CheckBoxField from "@/components/form/components/FieldTemplates/CheckBoxField";
import ICON from "../../utils/icon";

const TableHeader = ({ data, setCheckboxState, checkboxState, initialValues, router, searchParams }) => {
    const [sort, setSort] = useState({
        sortBy: initialValues?.sortBy || data?.sort?.initialSort || null,
        sortOrder: initialValues?.sortOrder || data?.sort?.initialSortOrder || "asc",
    });
    if (!data?.rows?.length) {
        return null;
    }

    const updateQueryParams = useCallback(
        (updates) => {
            const params = new URLSearchParams(searchParams?.toString());
            Object.entries(updates).forEach(([key, value]) => {
                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
            });

            return router.replace(`?${params.toString()}`, { scroll: false });
        },
        [searchParams, router]
    );

    const getSortIcon = useCallback(
        (headerItem) => {
            if (sort.sortBy !== headerItem) {
                return <span className={styles.initial_arrow}>{ICON.ARROW}</span>;
            }
            return sort.sortOrder === "asc" ? <span className={styles.up_arrow}>{ICON.ARROW}</span> : <span className={styles.down_arrow}>{ICON.ARROW}</span>;
        },
        [sort]
    );

    const handleSort = useCallback(
        async (headerItem) => {
            const newOrder = sort.sortBy === headerItem && sort.sortOrder === "asc" ? "desc" : "asc";

            setSort({ sortBy: headerItem, sortOrder: newOrder });
            await updateQueryParams({
                sortBy: headerItem,
                sortOrder: newOrder,
            });
        },
        [sort, updateQueryParams]
    );

    const firstRow = data.rows[0];
    const headerItems = Object.entries(firstRow).filter(([_, value]) => value.type !== "hidden");

    return (
        <thead className={styles.container}>
            <tr>
                {data.checkbox && (
                    <th className={styles.checkbox_cell}>
                        <CheckBoxField
                            formField={{
                                id: `header${initialValues.page || "1"}`,
                                name: `header${initialValues.page || "1"}`,
                                onChange: (event) => {
                                    const { name, value } = event.target;
                                    setCheckboxState((prev) => {
                                        const updatedState = { ...prev, [name]: value ? 1 : value };
                                        const page = parseInt(initialValues.page || "1");
                                        const limit = parseInt(initialValues.limit || "10");
                                        const startIndex = 0;
                                        const endIndex = limit;
                                        for (let i = startIndex; i < data?.rows?.length; i++) {
                                            updatedState[`${data?.rows[i]?.["Id"]?.value}`] = value;
                                        }

                                        return updatedState;
                                    });
                                },
                            }}
                            formValues={checkboxState}
                        />
                    </th>
                )}
                {headerItems.map(([headerItem, value], index) => (
                    <th className={styles.header_cell} key={`header-${index}-${headerItem}`} onClick={() => data.sorting && handleSort(value.key)}>
                        <div>
                            <span>{headerItem}</span>
                            {data.sorting && getSortIcon(value.key)}
                        </div>
                    </th>
                ))}
                {data.actionData && <th className={styles.header_cell}>Actions</th>}
            </tr>
        </thead>
    );
};

export default TableHeader;
