import Button from "../form/components/FieldTemplates/ButtonField";
import styles from "./index.module.css";

const AccessDenied = () => {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Access Denied</h1>
                <p className={styles.message}>Sorry, you don't have permission to access this page.</p>
                <Button className={styles.button} onClick={() => window.history.back()}>
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default AccessDenied;
