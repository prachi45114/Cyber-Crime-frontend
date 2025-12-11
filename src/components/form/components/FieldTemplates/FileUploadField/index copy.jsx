import { ICON } from "../../../utils/icons";
import styles from "../../../styles/DynamicForm.module.css";

const FileUploadField = (
    { id, name, label, required, accept, disabled, readonly, groupIndex, fieldName, uploadFunction, onChange, groupFields, style, info_text, viewFile },
    groupPreviewUrls,
    previewUrl,
    isDragging,
    handleFileDelete,
    handleDragOver,
    handleDragLeave,
    handleDrop
) => {
    const fileInfo = groupFields ? groupPreviewUrls[name]?.[groupIndex] : previewUrl;

    const labelStyle = {
        border: isDragging ? "1px dashed #007bff" : "1px dashed #ccc",
        backgroundColor: isDragging ? "#f1f8ff" : "#fff",
    };

    return (
        <div style={{ width: "100%" }}>
            <label>
                <span className={styles.file__label_icon}>
                    {ICON.UPLOAD} {label} {required && <span style={{ color: "red" }}>&nbsp;*</span>} {viewFile}{" "}
                </span>
            </label>
            <label
                htmlFor={id || "file-upload"}
                style={labelStyle}
                className={styles.upload_file}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, name, disabled, readonly, groupIndex, fieldName, uploadFunction)}
            >
                {!disabled && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1rem",
                            marginBottom: "1rem",
                        }}
                    >
                        <span className={styles.upload__icon}>{ICON.UPLOAD}</span>
                    </div>
                )}
                {!disabled && (
                    <div className={styles.drag__text}>
                        <p>Drag & drop files here or click to browse</p>
                        <p className="text-primary">Support for images, documents and other files up to 1MB each</p>
                    </div>
                )}
            </label>
            <input
                id={id || "file-upload"}
                style={{ display: "none" }}
                type="file"
                readOnly={readonly}
                disabled={disabled}
                name={name}
                onChange={(event) => {
                    onChange(event, groupIndex, fieldName, uploadFunction);
                }}
                required={required || false}
                accept={accept || ".pdf,.png,.jpg,.jpeg"}
            />
            {fileInfo && (
                <ul className={styles.upload_file_container}>
                    <li className={styles.uploaded_file_wrapper}>
                        <span>{fileInfo.fileName}</span>
                        <div className={styles.file__action_buttons}>
                            <a href={fileInfo.preview} target="_blank" rel="noopener noreferrer" title="View File">
                                {ICON.EYE}
                            </a>
                            <span title="Delete File" onClick={() => handleFileDelete(name, groupIndex, fieldName)}>
                                {ICON.DELETE}
                            </span>
                        </div>
                    </li>
                </ul>
            )}
            {info_text && <p className={styles.infoText}>{info_text}</p>}
        </div>
    );
};

export default FileUploadField;
