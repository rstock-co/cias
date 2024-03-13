import { StyledColorButton } from "./styles";

export const ColorButton = ({ onClick, buttonText, special = false, disabled = false, ...props }) => (
    <StyledColorButton
        {...props}
        variant="contained"
        onClick={onClick}
        special={special}
        disabled={disabled}
    >
        {buttonText}
    </StyledColorButton>
);
