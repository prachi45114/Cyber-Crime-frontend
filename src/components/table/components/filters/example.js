const externalFilters = {
    title: "Users Filters",
    // filterOnSubmit: true,
    filterFields: [
        {
            type: "select",
            name: "role",
            grid: 3,
            options: [
                { label: "Admin", value: "admin" },
                { label: "Author", value: "author" },
                { label: "Editor", value: "editor" },
                { label: "Maintainer", value: "Maintainer" },
                { label: "Subscriber", value: "subscriber" },
            ],
            placeholder: "Select Role",
        },
        {
            type: "select",
            name: "role",
            grid: 3,
            options: [
                { label: "Basic", value: "basic" },
                { label: "Company", value: "company" },
                { label: "Enterprise", value: "enterprise" },
                { label: "Maintainer", value: "Maintainer" },
                { label: "Subscriber", value: "subscriber" },
            ],
            placeholder: "Select Plan",
        },
        {
            type: "select",
            name: "status",
            grid: 3,
            options: [
                { label: "Pending", value: "pending" },
                { label: "Inactive", value: "inactive" },
                { label: "Active", value: "active" },
            ],
            placeholder: "Select Status",
        },
    ],
    parentFiltersKey: `[search][filters]`,
};
