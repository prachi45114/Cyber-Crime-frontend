import Swal from "sweetalert2";
import styles from "./index.module.css";

const ConfirmationAlert = {
    // Function to show delete confirmation
    showDeleteConfirmation: ({
        title = "Are you sure?",
        text = "You will not be able to recover this item!",
        confirmButtonText = "Yes, delete it!",
        cancelButtonText = "Cancel",
        onConfirm,
        onCancel,
    }) => {
        Swal.fire({
            title,
            text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText,
            cancelButtonText,
            customClass: {
                container: styles.alertContainer,
                popup: styles.alertPopup,
                header: styles.alertHeader,
                title: styles.alertTitle,
                closeButton: styles.alertCloseButton,
                icon: styles.alertIcon,
                content: styles.alertContent,
                input: styles.alertInput,
                actions: styles.alertActions,
                confirmButton: styles.alertConfirmButton,
                cancelButton: styles.alertCancelButton,
                footer: styles.alertFooter,
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                onConfirm?.();
            } else {
                onCancel?.();
            }
        });
    },

    // Function to show success message
    showSuccess: ({ title = "Success!", text = "Operation completed successfully.", confirmButtonText = "OK" }) => {
        Swal.fire({
            title,
            text,
            icon: "success",
            confirmButtonText,
            customClass: {
                container: styles.alertContainer,
                popup: styles.alertPopup,
                title: styles.alertTitle,
                confirmButton: styles.alertConfirmButton,
            },
            buttonsStyling: false,
        });
    },

    // Function to show error message
    showError: ({ title = "Error!", text = "Something went wrong.", confirmButtonText = "OK" }) => {
        Swal.fire({
            title,
            text,
            icon: "error",
            confirmButtonText,
            customClass: {
                container: styles.alertContainer,
                popup: styles.alertPopup,
                title: styles.alertTitle,
                confirmButton: styles.alertErrorButton,
            },
            buttonsStyling: false,
        });
    },
};

export default ConfirmationAlert;
