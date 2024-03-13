import { StyledColorButton } from "./styles";

export const ColorButton = ({ onClick, buttonText, highlighted = false, ...props }) => (
    <StyledColorButton
        {...props}
        variant="contained"
        onClick={onClick}
        highlighted={highlighted}
    >
        {buttonText}
    </StyledColorButton>
);
