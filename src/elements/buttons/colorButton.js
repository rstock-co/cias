import { StyledColorButton } from "./styles";

export const ColorButton = ({ onClick, buttonText, special = false, ...props }) => (
        <StyledColorButton
            {...props}
            variant="contained"
            onClick={onClick}
            special={special} 
        >
            {buttonText}
        </StyledColorButton>
    );
