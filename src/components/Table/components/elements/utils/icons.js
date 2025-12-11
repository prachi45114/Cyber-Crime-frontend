const FieldsIcons = {
    LOADER: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g>
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.14" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.29" transform="rotate(30 12 12)" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.43" transform="rotate(60 12 12)" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.57" transform="rotate(90 12 12)" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.71" transform="rotate(120 12 12)" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" opacity="0.86" transform="rotate(150 12 12)" />
                <rect width="2" height="5" x="11" y="1" fill="currentColor" transform="rotate(180 12 12)" />
                <animateTransform
                    attributeName="transform"
                    calcMode="discrete"
                    dur="0.75s"
                    repeatCount="indefinite"
                    type="rotate"
                    values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
                />
            </g>
        </svg>
    ),
    TAGS: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-tags"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 8v4.172a2 2 0 0 0 .586 1.414l5.71 5.71a2.41 2.41 0 0 0 3.408 0l3.592 -3.592a2.41 2.41 0 0 0 0 -3.408l-5.71 -5.71a2 2 0 0 0 -1.414 -.586h-4.172a2 2 0 0 0 -2 2z" />
            <path d="M18 19l1.592 -1.592a4.82 4.82 0 0 0 0 -6.816l-4.592 -4.592" />
            <path d="M7 10h-.01" />
        </svg>
    ),
};

export default FieldsIcons;
