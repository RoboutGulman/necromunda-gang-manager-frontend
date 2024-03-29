import {
  DialogTitle,
  DialogContent,
  Stack,
  FormControl,
  InputLabel,
  DialogActions,
  Button,
  FilledInput,
} from "@mui/material";
import React from "react";
import CheckboxWithText from "../../../components/Dialog/CheckboxWithText";
import UserDialog from "../../../components/Dialog/UserDialog";
import {
  useSelectedFightersState,
  useSelectedFightersDispatch,
} from "../../../providers/SelectedFightersProvider";
import { useFieldChange } from "../../../userHooks/useFieldChange";

interface State {
  numberOfFighters: number;
  onlySelectedFighters: boolean;
}

export interface SelectRandomFightersDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function SelectRandomFightersDialog({
  onClose,
  open,
}: SelectRandomFightersDialogProps) {
  const [info, setInfo] = React.useState<State>({
    numberOfFighters: 0,
    onlySelectedFighters: false,
  });
  const [inputError, setInputError] = React.useState(false);
  const handleChange = useFieldChange(info, setInfo);
  const fightersSelectionInfo = useSelectedFightersState().fighters;
  const selectedFightersReducer = useSelectedFightersDispatch();

  const infoIsCorrect = () => {
    let result = info.numberOfFighters > 0;
    if (info.onlySelectedFighters) {
      const numberOfSelectedFighters = fightersSelectionInfo.filter(
        (selection) => selection.isSelected
      ).length;
      result = result && info.numberOfFighters < numberOfSelectedFighters;
    } else {
      result = result && info.numberOfFighters < fightersSelectionInfo.length;
    }

    if (!result) {
      setInputError(true);
    }

    return result;
  };

  const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const handleSelect = () => {
    if (infoIsCorrect()) {
      let nf: number[] = [];
      let f = [...fightersSelectionInfo];
      if (info.onlySelectedFighters) {
        f = f.filter((selection) => selection.isSelected);
      }
      for (let x = 0; x < info.numberOfFighters; x++) {
        nf.push(f.splice(randomInt(0, f.length - 1), 1)[0].id);
      }
      selectedFightersReducer({ type: "delete all" });
      nf.forEach((item, index, array) => {
        selectedFightersReducer({ type: "select", id: item });
      });

      onClose();
    }
  };

  const onCheckboxClick = () => {
    setInfo({
      ...info,
      onlySelectedFighters: !info.onlySelectedFighters,
    });
  };

  return (
    <UserDialog handleClose={onClose} open={open}>
      <DialogTitle>Select random fighters</DialogTitle>
      <DialogContent
        sx={{
          minHeight: "200px",
        }}>
        <Stack spacing={2}>
          <FormControl
            sx={{
              m: 1,
            }}
            variant="filled">
            <InputLabel htmlFor="filled-adornment-password">
              Number of fighters to select
            </InputLabel>
            <FilledInput
              error={inputError}
              value={info.numberOfFighters}
              type="number"
              onChange={handleChange("numberOfFighters")}
              id="filled-basic"
            />
          </FormControl>
          <CheckboxWithText
            checked={info.onlySelectedFighters}
            onChange={onCheckboxClick}
            text="Select only from selected fighters"
            loading={false}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Back</Button>
        <Button onClick={handleSelect}>Select</Button>
      </DialogActions>
    </UserDialog>
  );
}
