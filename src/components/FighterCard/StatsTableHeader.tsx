import {
  styled,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { CharacteristicsNames } from "../../model/Characteristics";

interface StatsTableHeaderProps {
  children?: React.ReactNode;
}

function StatsTableHeader({ children }: StatsTableHeaderProps) {
  const StyledCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
      fontWeight: "600",
      borderColor: "#ba000d",
      padding: theme.spacing(0.5),
    },
  }));

  return (
    <TableHead>
      <TableRow>
        {CharacteristicsNames.map((value, index) => (
          <StyledCell key={index} align="center">
            {value}
          </StyledCell>
        ))}
        {children && <StyledCell>{children}</StyledCell>}
      </TableRow>
    </TableHead>
  );
}

export default StatsTableHeader;
