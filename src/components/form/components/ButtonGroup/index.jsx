import React from "react";
import "./index.css";
import { ICON } from "../../utils/icons";
import Button from "../FieldTemplates/ButtonField";

const ButtonGroup = ({ buttons, style = null }) => {
    return (
        buttons?.length > 0 && (
            <div className="button_group_container" style={style}>
                {buttons.map((button, index) => (
                    <Button
                        variant={button.variant}
                        outlined={button.outlined}
                        flat={button.flat}
                        rounded={button.rounded}
                        text={button.text}
                        plain={button.plain}
                        tonal={button.tonal}
                        icon={button.icon}
                        iconOnly={button.iconOnly}
                        fullWidth={button.fullWidth}
                        key={index}
                        type={button.type || "button"}
                        className={`${button.className}`}
                        onClick={button.onClick}
                        iconPosition={button.iconPosition}
                        disabled={button.disabled}
                        buttonContainerClassName={button.buttonContainerClassName}
                        loading={button.loading}
                    >
                        <span>{button.label}</span>
                    </Button>
                ))}
            </div>
        )
    );
};

export default ButtonGroup;
