import React from "react";
import styles from "./index.module.css";
import TableHeader from "../tableHeader";
import TableRow from "../tableRow";
import DataNotFound from "@/components/DataNotFound";
import TableLoading from "../tableLoading";

const TableView = ({ isLoading, checkboxState, setCheckboxState, data, router, initialValues, searchParams }) => {
    if (isLoading) {
        return <TableLoading />;
    }

    return (
        <>
            {data?.rows?.length > 0 ? (
                <table className="table">
                    <TableHeader checkboxState={checkboxState} setCheckboxState={setCheckboxState} data={data} router={router} initialValues={initialValues} searchParams={searchParams} />
                    <TableRow checkboxState={checkboxState} setCheckboxState={setCheckboxState} data={data} initialValues={initialValues} searchParams={searchParams} />
                </table>
            ) : (
                <div className={styles.grid_view_container}>
                    <DataNotFound message="Empty List" />
                </div>
            )}
        </>
    );
};

export default TableView;
