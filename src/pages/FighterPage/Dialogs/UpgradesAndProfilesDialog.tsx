import {
  DialogContent,
  DialogActions,
  Button,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  tableCellClasses,
  styled,
  Typography,
  IconButton,
} from "@mui/material";
import React, { FC, memo, useEffect, useState } from "react";
import ContainerWithCircularProgress from "../../../components/ContainerWithCircularProgress";
import DialogHeader from "../../../components/Dialog/DialogHeader";
import { StyledTable } from "../../../components/FighterCard/StyledTable";
import ItemsList from "../../../components/ItemsList";
import UserDialog from "../../../components/Dialog/UserDialog";
import { UpgradesAndProfilesInfo } from "../../../model/Dto/UpgradesAndProfilesInfo";
import { WeaponProfile } from "../../../model/Types";
import { Api } from "../../../request/api/api";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface UpgradesAndProfilesDialogProps {
  open: boolean;
  onClose: () => void;
  fighterWeaponId?: number;
  teamId: number;
}
//TODO: купить\добавить профиль\апгрейд. Вернуть деньги при возврате

export default function UpgradesAndProfilesDialog({
  open,
  onClose,
  fighterWeaponId,
  teamId,
}: UpgradesAndProfilesDialogProps) {
  const [loading, setLoading] = React.useState(false);

  const [upgradesAndProfiles, setUpgradesAndProfiles] = useState<
    UpgradesAndProfilesInfo | undefined
  >(undefined);
  const [cash, setCash] = useState<number | undefined>(undefined);

  const UpdateTeamCash = (teamId: number) => {
    setLoading(true);
    Api.team.getTeamCash(teamId).then((result) => {
      setCash(result.cash);
      setLoading(false);
    });
  };

  const fetchData = () => {
    if (fighterWeaponId) {
      setLoading(true);
      Api.fighterWeapon
        .getUpgradesAndProfiles(fighterWeaponId)
        .then((result) => {
          setLoading(false);
          setUpgradesAndProfiles(result.upgradesAndProfilesInfo);
        });
    }
  };

  const addProfile = (id: number) => {
    if (fighterWeaponId) {
      setLoading(true);
      Api.fighterWeapon.addProfile(fighterWeaponId, id, true).then((_) => {
        fetchData();
        UpdateTeamCash(teamId);
      });
    }
  };

  const removeProfile = (id: number) => {
    if (fighterWeaponId) {
      setLoading(true);
      Api.fighterWeapon
        .removeProfile(fighterWeaponId, id, 1)
        .then((_) => fetchData());
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
      UpdateTeamCash(teamId);
    }
  }, [open, fighterWeaponId]);

  return (
    <UserDialog open={open} handleClose={onClose}>
      <DialogHeader
        loading={loading}
        title="Profiles and upgrades"
        cash={cash}
      />
      <DialogContent>
        {!upgradesAndProfiles ? (
          <ContainerWithCircularProgress height="400px" />
        ) : (
          <>
            {upgradesAndProfiles.profiles.mounted.length ? (
              <>
                <Typography align="center" variant="h4">
                  Mounted profiles
                </Typography>
                <WeaponProfilesTable
                  profiles={upgradesAndProfiles.profiles.mounted}
                  variant="mounted"
                  onItemClick={removeProfile}
                />
              </>
            ) : (
              <></>
            )}
            {upgradesAndProfiles.profiles.available.length ? (
              <>
                <Typography align="center" variant="h4">
                  Availible profiles
                </Typography>
                <WeaponProfilesTable
                  profiles={upgradesAndProfiles.profiles.available}
                  variant="available"
                  onItemClick={addProfile}
                />
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Back</Button>
      </DialogActions>
    </UserDialog>
  );
}

interface WeaponProfilesTableProps {
  profiles: WeaponProfile[];
  variant: "mounted" | "available";
  onItemClick: (id: number) => void;
}

const WeaponProfilesTable: FC<WeaponProfilesTableProps> = memo(
  ({ profiles, onItemClick, variant }) => {
    return (
      <>
        {profiles.length ? (
          <TableContainer>
            <StyledTable size="small">
              <colgroup>
                <col style={{ width: "30%" }} />
                <col style={{ width: "5%" }} />
                <col style={{ width: "5%" }} />
                <col style={{ width: "5%" }} />
                <col style={{ width: "5%" }} />
                <col style={{ width: "5%" }} />
                <col style={{ width: "5%" }} />
                <col style={{ width: "5%" }} />
                <col style={{ width: "5%" }} />
                <col style={{ width: "25%" }} />
                <col style={{ width: "5%" }} />
              </colgroup>
              <TableHead>
                <TableRow>
                  <CellWithNoBorder colSpan={1} />
                  <CellWithNoBorder align="center" colSpan={2}>
                    Range
                  </CellWithNoBorder>
                  <CellWithNoBorder align="center" colSpan={2}>
                    Acc
                  </CellWithNoBorder>
                </TableRow>
                <TableRow>
                  <CellWithRightBorder>Profile</CellWithRightBorder>
                  <CellWithNoBorder align="center">S</CellWithNoBorder>
                  <CellWithRightBorder align="center">L</CellWithRightBorder>
                  <CellWithNoBorder align="center">S</CellWithNoBorder>
                  <CellWithRightBorder align="center">L</CellWithRightBorder>
                  <CellWithRightBorder align="center">Str</CellWithRightBorder>
                  <CellWithRightBorder align="center">Ap</CellWithRightBorder>
                  <CellWithRightBorder align="center">D</CellWithRightBorder>
                  <CellWithRightBorder align="center">Am</CellWithRightBorder>
                  <CellWithRightBorder>Traits</CellWithRightBorder>
                  <CellWithRightBorder>Cost</CellWithRightBorder>
                </TableRow>
              </TableHead>
              <TableBody>
                <ItemsList
                  items={profiles}
                  renderItem={(profile: WeaponProfile, index: number) => (
                    <Stroke
                      items={GetStrokeFromProfile(profile)}
                      onClick={() => onItemClick(profile.id)}
                      variant={variant}
                      isDefault={profile.isDefault}
                    />
                  )}
                />
              </TableBody>
            </StyledTable>
          </TableContainer>
        ) : (
          <></>
        )}
      </>
    );
  }
);

const GetStrokeFromProfile = (profile: WeaponProfile): string[] => {
  return [
    profile.name ?? "",
    profile.sr ?? "-",
    profile.lr ?? "-",
    profile.sm ?? "-",
    profile.lm ?? "-",
    profile.str ?? "-",
    profile.ap ?? "-",
    profile.d ?? "-",
    profile.am ?? "-",
    profile.traits.map((trait) => trait.name).join(","),
    profile.cost + "",
  ];
};

interface StrokeProps {
  items: string[];
  variant: "mounted" | "available";
  onClick: () => void;
  isDefault: boolean;
}

function Stroke({ items, onClick, variant, isDefault }: StrokeProps) {
  return (
    <TableRow>
      <CellWithRightBorder component="th" scope="row">
        {items[0]}
      </CellWithRightBorder>
      <CellWithNoBorder align="center">{items[1]}</CellWithNoBorder>
      <CellWithRightBorder align="center">{items[2]}</CellWithRightBorder>
      <CellWithNoBorder align="center">{items[3]}</CellWithNoBorder>
      <CellWithRightBorder align="center">{items[4]}</CellWithRightBorder>
      <CellWithRightBorder align="center">{items[5]}</CellWithRightBorder>
      <CellWithRightBorder align="center">{items[6]}</CellWithRightBorder>
      <CellWithRightBorder align="center">{items[7]}</CellWithRightBorder>
      <CellWithRightBorder align="center">{items[8]}</CellWithRightBorder>
      <CellWithRightBorder>{items[9]}</CellWithRightBorder>
      <CellWithRightBorder>{items[10]}</CellWithRightBorder>
      <CellWithNoBorder>
        <IconButton
          onClick={onClick}
          disabled={isDefault}
          aria-label={
            isDefault
              ? "default profile"
              : variant === "available"
              ? "add"
              : "delete"
          }>
          {variant === "available" ? <AddIcon /> : <DeleteIcon />}
        </IconButton>
      </CellWithNoBorder>
    </TableRow>
  );
}

const CellWithNoBorder = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: { fontWeight: "600" },
  borderWidth: 0,
}));

const CellWithRightBorder = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontWeight: "600",
  },
  borderWidth: 0,
  borderRightWidth: 1,
  borderRightColor: theme.palette.grey[500],
  borderRightStyle: "solid",
}));
