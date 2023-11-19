import { StyledColorButton } from "./styles";

export const ColorButton = ({ onClick, buttonText }) => {
    return (
        <StyledColorButton
            variant="contained"
            onClick={onClick}
            sx={{ marginTop: 6 }} // You can adjust this as per requirement or make it a prop
        >
            {buttonText}
        </StyledColorButton>
    );
};