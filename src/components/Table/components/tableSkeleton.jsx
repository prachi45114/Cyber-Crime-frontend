function SkeletonTable({ row = 10, column = 8, header }) {
    return (
        <div className="border-gray-200 bg-white shadow-sm dark:border-[#3e3e42] dark:bg-[#252526]">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    {header && (
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr className="border-b border-gray-200  dark:border-gray-800  bg-gray-50 dark:bg-gray-800">
                                {Array.from({ length: column }).map((_, index) => (
                                    <th key={index} className="whitespace-nowrap px-6 py-3 text-left">
                                        <div className="h-4 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}

                    <tbody>
                        {Array.from({ length: row }).map((_, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-gray-200 dark:border-gray-800">
                                {Array.from({ length: 8 }).map((_, colIndex) => (
                                    <td key={colIndex} className="whitespace-nowrap px-6 py-4">
                                        <div className="h-4 w-16 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SkeletonTable;
