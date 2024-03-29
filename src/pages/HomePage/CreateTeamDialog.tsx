import * as React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  FilledInput,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserDialog from "../../components/Dialog/UserDialog";
import { GetAllFactionsResult } from "../../request/api/faction/getAllFactions";
import { useEffect } from "react";
import { Api } from "../../request/api/api";
import { useUserState } from "../../providers/UserProvider";
import { useFieldChange } from "../../userHooks/useFieldChange";
import { useTranslation } from "react-i18next";
import DialogHeader from "../../components/Dialog/DialogHeader";

interface State {
  name: string;
  startCredits: number;
  factionId: string;
}

interface CreateTeamDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTeamDialog({
  open,
  onClose,
}: CreateTeamDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUserId = useUserState().result.user?.id;
  const [teamInfo, setTeamInfo] = React.useState<State>({
    name: "",
    factionId: "1",
    startCredits: 1200,
  });
  const handleChange = useFieldChange(teamInfo, setTeamInfo);
  const [loading, setLoading] = React.useState(false);
  const [inputError, setInputError] = React.useState<
    false | "name" | "startCredits" | "server" | "other"
  >(false);

  const [factions, setFactions] = React.useState<
    GetAllFactionsResult | undefined
  >(undefined);

  useEffect(() => {
    Api.factions.getAllFactions().then((result) => {
      setFactions(result);
      setTeamInfo({ ...teamInfo, factionId: result[0].id.toString() });
    });
  }, []);

  const teamInfoIsCorrect = () => {
    if (teamInfo.name.length === 0) {
      setInputError("name");
      return false;
    }

    if (!teamInfo.startCredits || isNaN(+teamInfo.startCredits)) {
      setInputError("startCredits");
      return false;
    }

    if (isNaN(+teamInfo.factionId) || currentUserId == undefined) {
      setInputError("other");
      return false;
    }

    return true;
  };
  const handleCreate = async () => {
    if (teamInfoIsCorrect()) {
      setLoading(true);

      let createTeamResult = await Api.team.createTeam({
        name: teamInfo.name,
        startingCredits: +teamInfo.startCredits,
        factionId: +teamInfo.factionId,
        userId: +currentUserId!,
      });

      setLoading(false);

      if (createTeamResult.isSuccess) {
        onClose();
        navigate(`/roster/${createTeamResult.createdTeamId}`);
      } else {
        setInputError("server");
      }
    }
  };

  const handleTypeChange =
    (prop: keyof State) => (event: SelectChangeEvent) => {
      setTeamInfo({
        ...teamInfo,
        [prop]: event.target.value as string,
      });
    };

  return (
    <UserDialog open={open} handleClose={onClose}>
      <DialogHeader
        loading={loading}
        title={t("home:createRoster")}
      />
      <DialogContent>
        {!factions ? (
          <CircularProgress />
        ) : (
          <Stack spacing={2}>
            <TextField
              error={inputError === "name"}
              value={teamInfo.name}
              onChange={handleChange("name")}
              id="filled-basic"
              label={t("home:createGangDialog.name")}
              variant="filled"
            />
            <FormControl variant="filled" sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel>
                {t("home:createGangDialog.faction")}
              </InputLabel>
              <Select
                autoFocus
                value={teamInfo.factionId.toString()}
                onChange={handleTypeChange("factionId")}
                label="Faction"
                inputProps={{
                  name: "faction",
                  id: "faction",
                }}>
                {factions.map((item, number) => (
                  <MenuItem key={number} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{
                m: 1,
              }}
              variant="filled">
              <InputLabel htmlFor="filled-adornment-password">
                {t("home:createGangDialog.startCredits")}
              </InputLabel>
              <FilledInput
                value={teamInfo.startCredits}
                error={inputError === "startCredits"}
                type="number"
                onChange={handleChange("startCredits")}
                id="filled-basic"
              />
            </FormControl>
            {inputError === "server" ? (
              <Alert severity="error">
                {t("home:createGangDialog.serverError")}
              </Alert>
            ) : (
              <></>
            )}
            {inputError === "other" ? (
              <Alert severity="error">
                {t("home:createGangDialog.unhandledError")}
              </Alert>
            ) : (
              <></>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t("home:createGangDialog.back")}
        </Button>
        <Button onClick={handleCreate}>
          {t("home:createGangDialog.create")}
        </Button>
      </DialogActions>
    </UserDialog>
  );
}
