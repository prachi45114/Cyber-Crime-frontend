class TableUtils {
    static calculatePageNumber = (index, currentPage, totalPages) => {
        let pageNum = index + 1;

        if (totalPages > 5) {
            if (currentPage <= 3) {
                pageNum = index + 1;
            } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
            } else {
                pageNum = currentPage - 2 + index;
            }
        }

        return pageNum;
    };
}

export default TableUtils;
