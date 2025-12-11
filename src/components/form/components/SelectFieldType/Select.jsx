import React from "react";
import Select, { components } from "react-select";
import chroma from "chroma-js";
const DropdownIndicator = (props) => {
    if (props.selectProps.isDisabled) {
        return null;
    }

    return <components.DropdownIndicator {...props} />;
};

const MultiValueRemove = (props) => {
    if (props.selectProps.isDisabled) {
        return null;
    }

    return <components.MultiValueRemove {...props} />;
};

const dot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",

    ":before": {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: "block",
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

const colorStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);
        return {
            ...styles,
            backgroundColor: isDisabled ? undefined : isSelected ? "data.color" : isFocused ? color.alpha(0.1).css() : undefined,
            color: isDisabled ? "#ccc" : isSelected ? (chroma.contrast(color, "white") > 2 ? "white" : "black") : data.color,
            cursor: isDisabled ? "not-allowed" : "default",

            ":active": {
                ...styles[":active"],
                backgroundColor: !isDisabled ? (isSelected ? data.color : color.alpha(0.3).css()) : undefined,
            },
        };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot("#ccc") }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};

const CustomSingleValue = (props) => <components.SingleValue {...props}>{props.isDisabled ? <span>{props.data.label}</span> : props.children}</components.SingleValue>;

const CustomMultiValueLabel = (props) => <components.MultiValueLabel {...props}>{props.data.disabled ? <span>{props.data.label}</span> : props.children}</components.MultiValueLabel>;
const getStyles = (style, error) => {
    let styles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "var(--background-color)",
            textAlign: "left",
            color: "var(--text-color)",
            fontSize: "var(--input-font-size)",
            borderColor: error ? "var(--error-color)" : state.isFocused ? "rgb(249, 115, 22)" : "var(--border-color)",
            boxShadow: state.isFocused && error ? "0 0 0 3px rgba(255, 76, 81, 0.1)" : state.isFocused ? `0 0 0 3px rgba(249, 115, 22, 0.1)` : "none",
            "&:hover": {
                borderColor: error ? "var(--error-color)" : state.isFocused ? "rgb(249, 115, 22)" : "var(--hover-border-color)",
            },
            "&:focus": {
                borderColor: error ? "var(--error-color)" : "rgb(249, 115, 22)",
            },
            border: state.isFocused && error ? "2px solid var(--error-color)" : error ? "2px solid var(--error-color)" : state.isFocused ? "2px solid rgb(249, 115, 22)" : "1px solid var(--border-color)",
            paddingBlock: "0.1rem",
            paddingInline: "0.15rem",
            borderRadius: "0.5rem",
            fontWeight: "400",
            minHeight: "2.714rem",
        }),
        menu: (provided) => ({
            ...provided,
            textAlign: "left",
            fontSize: "var(--input-font-size)",
            boxShadow: "0 2px 8px var(--select-box-shadow), 0 0 transparent, 0 0 transparent;",
            backgroundColor: "var(--whiteBackground)",
            padding: "0.45rem",
            paddingRight: "0.25rem",
            paddingTop: "0.25rem",
            border: "1px solid var(--border-color)",
            borderRadius: "0.5rem",
            color: "var(--text-color)",
            zIndex: 1000,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected 
                ? "rgba(249, 115, 22, 0.15)" 
                : state.isFocused 
                    ? "var(--primary-hover-color)" 
                    : "transparent",
            color: state.isSelected ? "rgb(249, 115, 22)" : "var(--text-color)",
            fontSize: "var(--input-font-size)",
            padding: "0.55rem 0.75rem",
            cursor: "pointer",
            borderRadius: "0.37rem",
            letterSpacing: "0.25px",
            "&:active": {
                backgroundColor: state.isSelected ? "rgba(249, 115, 22, 0.2)" : "var(--primary-hover-color)",
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "var(--active-color)",
            color: "var(--text-color)",
            borderRadius: "5px",
            paddingInline: "0.5rem",
            fontSize: "var(--input-font-size)", // Add font size
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: "white",
            fontSize: "var(--input-font-size)", // Add font size
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "var(--placeholder-color)",
            fontWeight: "var(--placeholder-font-weight)",
            fontSize: "var(--placeholder-font-size)",
        }),
        ...style,
    };

    if (style?.color) {
        styles = { ...styles, ...colorStyles };
    }
    return styles;
};

const CustomSelect = ({ name, formValues, handleSelectChange, options, multiple, required, disabled, style = {}, classNames = [], error, placeholder, type, clearOption, value }) => (
    <Select
        id={name}
        name={name}
        value={
            multiple
                ? options?.filter((option) => formValues?.[name]?.includes(option.value) || value?.includes(option.value))
                : options.find((option) => option.value === formValues?.[name] || option.value === value)
        }
        onChange={(selectedOption) => handleSelectChange({ target: { name, value: multiple ? selectedOption?.map((opt) => opt.value) : selectedOption?.value } })}
        options={options}
        isMulti={multiple}
        required={required || false}
        isDisabled={disabled}
        components={{
            DropdownIndicator,
            MultiValueRemove,
            SingleValue: CustomSingleValue,
            MultiValueLabel: CustomMultiValueLabel,
        }}
        styles={getStyles(style, error)}
        placeholder={placeholder}
        instanceId="my-select"
        className={["react-select-container", ...classNames].join(" ")}
        classNamePrefix="react-select"
        isClearable={clearOption}
    />
);

export default CustomSelect;
