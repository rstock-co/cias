import { StyledChip } from "./styles";

export const ToggleChipButton = ({ onToggle, blended, hash }) => (
  <StyledChip
    label={blended ? "Blended" : "Not blended"}
    onClick={() => onToggle(hash, !blended)}
    blended={blended} 
  />
);

