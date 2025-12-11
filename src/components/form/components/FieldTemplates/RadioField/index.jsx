import styles from "../../../styles/DynamicForm.module.css";

const RadioField = ({ id, name, options, required, onChange, disabled, readonly, style }, formValues) => {
    return (
        <div className="form-check" style={style?.formGroup}>
            {options &&
                options.map((option, index) => (
                    <div key={index}>
                        <input
                            type="radio"
                            readOnly={readonly}
                            id={`${id}-${index}`}
                            name={name}
                            disabled={disabled}
                            value={option.value}
                            checked={formValues[name] === option.value}
                            onChange={onChange}
                            className={styles.formCheckInput}
                            style={style?.input}
                        />
                        <label htmlFor={`${id}-${index}`} className="form-check-label">
                            {option.label} {required && <span style={{ color: "red" }}>&nbsp;*</span>}
                        </label>
                    </div>
                ))}
        </div>
    );
};

export default RadioField;
