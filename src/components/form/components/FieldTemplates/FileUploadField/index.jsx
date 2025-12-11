import React, { useState, useCallback, useEffect, useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageTransform from "filepond-plugin-image-transform";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginImageCrop from "filepond-plugin-image-crop";
import FilePondPluginPdfPreview from "filepond-plugin-pdf-preview";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import styles from "./index.module.css";
// import { useFileUpload } from "@/services/hooks/fileUpload";
import apiConstants from "@/services/utils/constants";
import "filepond-plugin-pdf-preview/dist/filepond-plugin-pdf-preview.min.css";

// Register all plugins
registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileEncode,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,
    FilePondPluginImageResize,
    FilePondPluginImageCrop,
    FilePondPluginImageTransform
    // FilePondPluginPdfPreview
);

const fileTypeMapping = {
    image: "image/*",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    json: "application/json", 
};

const FileUploadField = ({ formField, errors, formValues }) => {
    const {
        id,
        name,
        label,
        accept = ["image", "doc", "pdf", "docx"],
        disabled = false,
        readonly = false,
        onChange,
        style,
        info_text,
        multiple = false,
        maxFileSize = "5MB",
        maxFiles = 3,
        imagePreviewHeight = 400,
        imageCropAspectRatio = "1:1",
        imageResizeTargetWidth = 800,
        imageResizeTargetHeight = 800,
        imageResizeMode = "cover",
        imageQuality = 90,
        url,
        defaultValue,
        validationRules,
    } = formField;

    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const pondRef = useRef(null);
    const isRemovingRef = useRef(false);
    const isProcessingRef = useRef(false);
    const initialLoadRef = useRef(true);

    // Setup a style element to add custom CSS for file links
    useEffect(() => {
        const styleEl = document.createElement("style");
        styleEl.innerHTML = `
            .filepond--file-info-main.with-link {
                cursor: pointer;
                text-decoration: underline;
                color: #0066cc;
            }
        `;
        document.head.appendChild(styleEl);

        return () => {
            document.head.removeChild(styleEl);
        };
    }, []);

    const processDefaultValue = useCallback((value) => {
        if (!value || value.status == "2") return null;
        const baseUrl = apiConstants.BACKEND_API_BASE_URL;
        const fileUrl = `${baseUrl}/files/file/${value._id}`;

        return {
            source: fileUrl,
            options: {
                type: "local",
                file: {
                    name: value.fileName || "File",
                    size: value.size || 0,
                    type: value.mimeType || "",
                },
                metadata: {
                    fileUrl: fileUrl,
                    isDefault: true,
                    fileId: value._id,
                    originalFileName: value.fileName,
                },
            },
        };
    }, []);

    // Add this custom CSS to make the file name clickable
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
      .filepond--file-info-main {
        position: relative;
        z-index: 1;
      }
      
      .custom-file-link {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        opacity: 0;
      }
    `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const processFilePondItem = () => {
        // Check if pondRef.current exists first
        if (!pondRef.current || !pondRef.current._element) return;

        // Get all file items
        const fileItems = pondRef.current._element.querySelectorAll(".filepond--item");
        console.log(fileItems, fileItems.length);
        fileItems.forEach((item) => {
            const fileId = item.id?.split("item-")[1];
            console.log("fileId", fileId);
            const fileInfoElement = item.querySelector(".filepond--file-info-main");
            console.log("fileInfoElement", fileInfoElement);

            if (!fileInfoElement) return;
            // Find the file in FilePond's files
            const files = pondRef.current.getFiles();
            console.log("files", files);
            if (!files || !files.length) return;

            const file = files.find((f) => f.id === fileId);
            console.log("file", file);
            if (!file) return;

            // Get URL from metadata
            const fileUrl = file.getMetadata("fileUrl");

            if (fileUrl && !fileInfoElement.hasAttribute("data-linked")) {
                // Create an anchor element
                const linkElement = document.createElement("a");
                linkElement.href = fileUrl;
                linkElement.textContent = fileInfoElement.textContent;
                linkElement.style.textDecoration = "underline";
                linkElement.style.userSelect = "auto";
                linkElement.style.fontSize = "0.85rem";
                linkElement.style.pointerEvents = "auto";
                linkElement.style.cursor = "pointer";
                linkElement.target = "_blank";
                linkElement.rel = "noopener noreferrer";

                // Replace the span with the anchor tag
                fileInfoElement.replaceWith(linkElement);
            }
        });
    };

    // Use useEffect with a delay to ensure FilePond is fully initialized
    useEffect(() => {
        const timer = setTimeout(() => {
            processFilePondItem();
        }, 500); // Give FilePond time to initialize

        return () => clearTimeout(timer);
    }, [files]);

    // Add another effect for MutationObserver
    useEffect(() => {
        // Wait for component to be fully mounted
        const timer = setTimeout(() => {
            if (!pondRef.current || !pondRef.current.element) return;

            const observer = new MutationObserver(() => {
                // Use setTimeout to ensure changes are fully applied
                setTimeout(processFilePondItem, 100);
            });

            observer.observe(pondRef.current.element, {
                childList: true,
                subtree: true,
            });

            return () => observer.disconnect();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (defaultValue && initialLoadRef.current && Array.isArray(defaultValue)) {
            const processedFiles = defaultValue.map((value) => processDefaultValue(value)).filter(Boolean);
            if (processedFiles.length > 0) {
                setFiles(processedFiles);
                initialLoadRef.current = false;
            }
        }
    }, [defaultValue, processDefaultValue]);

    const handleValidation = useCallback(() => {
        if (validationRules?.required && files.length === 0 && touched) {
            setError("This field is required");
            return false;
        }
        setError("");
        return true;
    }, [validationRules, files.length, touched]);

    useEffect(() => {
        handleValidation();
    }, [files, touched, handleValidation]);

    useEffect(() => {
        if (errors?.[name]) {
            setError(errors[name]);
            setTouched(true);
        }
    }, [errors, name]);

    const { fileUpload } = useFileUpload();

    const handleUpload = async (file) => {
        if (!file?.file || isProcessingRef.current) return;

        try {
            isProcessingRef.current = true;
            if (url) {
                await fileUpload.execute({
                    url: url || "/owners/documents/identity-proof/upload",
                    payload: {
                        ["file"]: file.file,
                    },
                    options: {
                        showNotification: true,
                        onProgress: (percentage) => {
                            console.log(`Upload progress: ${percentage}%`);
                        },
                    },
                    onSuccess: (data) => {
                        console.log("Upload successful:", data);
                        onChange({
                            target: {
                                value: !multiple ? data.id : formValues[name]?.length > 0 ? [...formValues[name].map((file) => (typeof file === "object" ? file._id : file)), data.id] : [data.id],
                                name,
                            },
                        });
                    },
                    onError: (error) => {
                        console.error("Upload failed:", error);
                        setError("Upload failed: " + (error.message || "Unknown error"));
                    },
                });
            } else {
                onChange({
                    target: {
                        value: file.file,
                        name,
                    },
                });
            }
        } catch (error) {
            console.error("Upload error:", error);
            setError("Upload failed: " + (error.message || "Unknown error"));
        } finally {
            isProcessingRef.current = false;
        }
    };

    const handleProcessFile = async (error, file) => {
        if (isRemovingRef.current || isProcessingRef.current) {
            return;
        }

        setTouched(true);
        if (error) {
            setError(error.message);
            return;
        }

        try {
            const processedFile = {
                source: file.file,
                options: {
                    type: "local",
                },
            };

            setFiles((prevFiles) => {
                const updatedFiles = multiple ? [...prevFiles, processedFile] : [processedFile];
                if (!file.getMetadata("isDefault")) {
                    handleUpload(file);
                }
                return updatedFiles;
            });

            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRemoveFile = (error, file) => {
        isRemovingRef.current = true;
        setFiles((prevFiles) => {
            const fileId = file.getMetadata("fileId");
            if (fileId) {
                onChange({
                    target: {
                        value: !multiple ? fileId : formValues["deletedFile"]?.length > 0 ? [...formValues["deletedFile"].map((file) => (typeof file === "object" ? fileId : file)), fileId] : [fileId],
                        name: "deletedFile",
                    },
                });

                onChange({
                    target: {
                        value: !multiple ? undefined : formValues[name]?.length > 0 ? [...formValues[name].filter((file) => (typeof file === "object" ? file._id != fileId : file != fileId))] : [],
                        name,
                    },
                });
            }
            return prevFiles.filter((f) => f?.options?.metadata?.fileId != fileId);
        });

        if (file.source instanceof File) {
            URL.revokeObjectURL(URL.createObjectURL(file.source));
        }

        isRemovingRef.current = false;
    };

    // Add click event listeners to file items after they're rendered
    useEffect(() => {
        if (!pondRef.current || initialLoadRef.current) return;

        const pond = pondRef.current;

        // Setup MutationObserver to watch for FilePond adding new elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // For each added file item node, add our click listener
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.classList && node.classList.contains("filepond--item")) {
                        const fileId = node.id;
                        const fileInfoElement = node.querySelector(".filepond--file-info-main");

                        if (fileInfoElement) {
                            // Find the corresponding FilePond file
                            const pondFiles = pond.getFiles();
                            const file = pondFiles.find((f) => f.id === fileId);

                            if (file && file.getMetadata("fileUrl")) {
                                fileInfoElement.classList.add("with-link");
                                fileInfoElement.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(file.getMetadata("fileUrl"), "_blank");
                                });
                            }
                        }
                    }
                }
            });
        });

        // Start observing the FilePond container if it exists
        const pondElement = pond.element;
        if (pondElement) {
            observer.observe(pondElement, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, [files]);

    // Clean up URLs when component unmounts
    useEffect(() => {
        return () => {
            files.forEach((file) => {
                if (file.source instanceof File) {
                    URL.revokeObjectURL(URL.createObjectURL(file.source));
                }
            });
        };
    }, [files]);

    return (
        <div className={styles.fileUploadContainer} style={style}>
            <div className={styles.labelWrapper}>
                <label className={styles.label}>
                    {label}
                    {validationRules?.required && <span className={styles.required}>*</span>}
                </label>
                {info_text && <span className={styles.infoText}>{info_text}</span>}
            </div>

            <FilePond
                ref={pondRef}
                id={id}
                name={name}
                disabled={disabled || readonly}
                allowMultiple={multiple}
                maxFiles={maxFiles}
                acceptedFileTypes={accept.map((type) => fileTypeMapping[type.trim()])}
                maxFileSize={maxFileSize}
                files={files}
                onaddfile={handleProcessFile}
                onremovefile={handleRemoveFile}
                onprocessfile={(error, file) => {
                    // After a file is processed, add clickable functionality
                    if (!error && file.getMetadata("fileUrl")) {
                        setTimeout(() => {
                            const fileElement = document.querySelector(`[id="${file.id}"] .filepond--file-info-main`);
                            if (fileElement) {
                                fileElement.classList.add("with-link");
                                fileElement.addEventListener("click", (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.open(file.getMetadata("fileUrl"), "_blank");
                                });
                            }
                        }, 100);
                    }
                }}
                allowFileEncode={true}
                allowImagePreview={true}
                allowImageTransform={true}
                imagePreviewHeight={imagePreviewHeight}
                imageCropAspectRatio={imageCropAspectRatio}
                imageResizeTargetWidth={imageResizeTargetWidth}
                imageResizeTargetHeight={imageResizeTargetHeight}
                imageResizeMode={imageResizeMode}
                imageTransformOutputQuality={imageQuality}
                imageTransformOutputQualityMode="optional"
                instantUpload={false}
                allowFileTypeValidation={true}
                fileValidateTypeLabelExpectedTypes="Accepts {allTypes}"
                server={{
                    // Custom load method to handle previews for existing files
                    load: (source, load, error, progress, abort, headers) => {
                        const fileUrl = files.find((f) => f.source === source)?.options?.metadata?.fileUrl;
                        if (fileUrl) {
                            // For image files, fetch to get blob for preview
                            fetch(fileUrl)
                                .then((response) => {
                                    if (!response.ok) throw new Error("Network response was not ok");
                                    return response.blob();
                                })
                                .then((blob) => {
                                    load(blob);
                                })
                                .catch((err) => {
                                    console.error("Error loading file:", err);
                                    error("Could not load file");
                                });

                            return { abort };
                        } else {
                            // If no fileUrl is available, just pass through
                            error("No file URL available");
                        }
                    },
                }}
                labelFileProcessing="Loading preview..."
                checkValidity={true}
                labelIdle={`
                    <div class="${styles.file_upload_container}">
                        ${
                            !disabled
                                ? `
                            <div>
                                <span class="${styles.upload__icon}">
                                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M8 22.0002H16C18.8284 22.0002 20.2426 22.0002 21.1213 21.1215C22 20.2429 22 18.8286 22 16.0002V15.0002C22 12.1718 22 10.7576 21.1213 9.8789C20.3529 9.11051 19.175 9.01406 17 9.00195M7 9.00195C4.82497 9.01406 3.64706 9.11051 2.87868 9.87889C2 10.7576 2 12.1718 2 15.0002L2 16.0002C2 18.8286 2 20.2429 2.87868 21.1215C3.17848 21.4213 3.54062 21.6188 4 21.749" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                </span>
                            </div>
                        `
                                : ""
                        }
                        ${
                            !disabled
                                ? `
                            <div class="${styles.drag__text}">
                                <p>Drag & drop files here or click to browse</p>
                                <p class="text-primary">Support for images, documents and other files up to 1MB each</p>
                            </div>
                        `
                                : ""
                        }
                    </div>
                `}
                className={`${styles.filePond} ${error ? styles.hasError : ""}`}
                labelFile={(file) => {
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    const fileUrl = file?.getMetadata?.("fileUrl");
                    const originalFileName = file?.getMetadata?.("originalFileName") || file.filename;

                    if (fileUrl) {
                        // Create a link to open file in new tab
                        setTimeout(() => {
                            const fileElement = document.querySelector(`[data-filepond-item-state="processing-complete"][id="${file.id}"] .filepond--file-info-main`);
                            if (fileElement && !fileElement.querySelector("a")) {
                                const fileName = originalFileName || "File";
                                const linkElement = document.createElement("a");
                                linkElement.href = fileUrl;
                                linkElement.target = "_blank";
                                linkElement.innerHTML = fileName;
                                linkElement.style.color = "inherit";
                                linkElement.style.textDecoration = "underline";

                                // Replace the file name text with the link
                                fileElement.innerHTML = "";
                                fileElement.appendChild(linkElement);
                            }
                        }, 100);
                    }

                    return originalFileName || file.filename;
                }}
            />

            {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
    );
};

export default FileUploadField;
