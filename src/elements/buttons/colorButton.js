import { StyledColorButton } from "./styles";

export const ColorButton = ({ onClick, buttonText }) => {
    return (
        <StyledColorButton
            variant="contained"
            onClick={onClick}
        >
            {buttonText}
        </StyledColorButton>
    );
};