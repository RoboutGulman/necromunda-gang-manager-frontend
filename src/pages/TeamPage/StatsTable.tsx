import {
  ListItem,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import StatsTableHeader from "../../components/FighterCard/StatsTableHeader";
import { StyledTable } from "../../components/FighterCard/StyledTable";
import { Characteristics } from "../../model/Characteristics";

interface StatsTableProps {
  characteristics: Characteristics;
  xp: number;
  lvl: number;
}

export function GetCharacteristicView(
  chars: Characteristics,
  xp?: number,
  lvl?: number
): string[] {
  let result = [
    chars.m + '"',
    chars.ws + "+",
    chars.bs + "+",
    chars.s + "",
    chars.t + "",
    chars.w + "",
    chars.i + "+",
    chars.a + "",
    chars.ld + "+",
    chars.cl + "+",
    chars.wp + "+",
    chars.int + "+",
  ];
  if (xp != undefined) result.push(xp + "");
  if (lvl != undefined) result.push(lvl + "");
  return result;
}

const CellWithNoBorder = styled(TableCell)(({ theme }) => ({
  borderWidth: 0,
}));

export default function StatsTable(props: StatsTableProps) {
  return (
    <ListItem disablePadding>
      <TableContainer>
        <StyledTable size="small">
          <StatsTableHeader></StatsTableHeader>
          <TableBody>
            <TableRow>
              {GetCharacteristicView(
                props.characteristics,
                props.xp,
                props.lvl
              ).map((stat, index) => (
                <CellWithNoBorder key={index} align="center">
                  {stat}
                </CellWithNoBorder>
              ))}
            </TableRow>
          </TableBody>
        </StyledTable>
      </TableContainer>
    </ListItem>
  );
}
