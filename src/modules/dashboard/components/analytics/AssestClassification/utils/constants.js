const assetsClassficationConstants = {
    app: {
        configParameters: {
            rotate: { min: -90, max: 90 },
            align: { options: { left: "left", center: "center", right: "right" } },
            verticalAlign: { options: { top: "top", middle: "middle", bottom: "bottom" } },
            position: {
                options: [
                    "left",
                    "right",
                    "top",
                    "bottom",
                    "inside",
                    "insideTop",
                    "insideLeft",
                    "insideRight",
                    "insideBottom",
                    "insideTopLeft",
                    "insideTopRight",
                    "insideBottomLeft",
                    "insideBottomRight",
                ],
            },
            distance: { min: 0, max: 100 },
        },
        config: {
            rotate: 90,
            align: "left",
            verticalAlign: "middle",
            position: "insideBottom",
            distance: 15,
            onChange: null,
        },
    },
};

export default assetsClassficationConstants;
