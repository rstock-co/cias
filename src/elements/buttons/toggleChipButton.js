import { StyledChip } from "./styles";

export const ToggleChipButton = ({ onToggle, isBlended, txnHash }) => (
  <StyledChip
    label={isBlended ? "Blended" : "Not blended"}
    onClick={() => onToggle(txnHash, !isBlended)}
    isBlended={isBlended} 
  />
);

