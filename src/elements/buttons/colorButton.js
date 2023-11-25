import { StyledColorButton } from "./styles";

export const ColorButton = ({ onClick, buttonText }) => (
        <StyledColorButton
            variant="contained"
            onClick={onClick}
        >
            {buttonText}
        </StyledColorButton>
    );
