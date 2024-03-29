import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { RecentTeam, RecentTeamsDto } from "../../model/Dto/ReсentTeamsDto";
import ItemsList from "../../components/ItemsList";
import { useTranslation } from "react-i18next";
import { Api } from "../../request/api/api";
import ContainerWithCircularProgress from "../../components/ContainerWithCircularProgress";

export default function RecentTeams() {
  const { t } = useTranslation();
  const [recentTeams, setRecentTeams] = useState<RecentTeamsDto>();

  useEffect(() => {
    Api.team.getRecentTeams().then((result) => setRecentTeams(result));
  }, []);

  return (
    <Container fixed>
      <Typography
        align="center"
        sx={{ fontWeight: "600" }}
        variant="h5"
        color="secondary"
        gutterBottom>
        {t("home:recentGangsTitle")}
      </Typography>
      {!recentTeams ? (
        <ContainerWithCircularProgress height="400px" />
      ) : (
        <>
          <Typography align="center" variant="body1" color="white" gutterBottom>
            {t("home:recentGangsCounting", {
              number: `${recentTeams?.totalTeamsNumber}`
            })}
          </Typography>
          <Box
            sx={{
              margin: "auto",
              border: "solid",
              width: "100%",
              maxWidth: 500,
              background:
                "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4))",
            }}>
            <List sx={{ padding: 0 }}>
              <ItemsList
                items={recentTeams?.teams}
                renderItem={(item: RecentTeam, index: number) =>
                  gangPrewiew(index, item)
                }
              />
            </List>
          </Box>
        </>
      )}
    </Container>
  );
}

interface GridItemWithTypographyProps {
  xs: number;
  content: string;
  color: string;
}

const getDate = (date: Date): string => {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).valueOf();

  return date.toLocaleString(
    "ru-RU",
    date.valueOf() < today.valueOf()
      ? {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }
      : {
          hour: "numeric",
          minute: "numeric",
        }
  );
};

function gangPrewiew(index: number, item: RecentTeam) {
  const { t } = useTranslation();
  const date = new Date(item.lastEditTime * 1000);
  return (
    <Box key={index}>
      <ListItem>
        <Grid container sx={{ flexGrow: 1 }}>
          <Grid sx={{ pt: "7px" }} item xs={8}>
            <Link
              color="secondary"
              component={RouterLink}
              to={`/roster/${item.id}`}>
              {item.name}
            </Link>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="text"
              color="secondary"
              startIcon={<AccountBoxIcon />}>
              {item.creator.name}
            </Button>
          </Grid>
        </Grid>
      </ListItem>
      <ListItem>
        <Grid container sx={{ flexGrow: 1 }}>
          <GridItemWithTypography
            xs={5}
            content={item.faction.name}
            color="white"
          />
          <GridItemWithTypography
            xs={3}
            content={t("home:rating", {
              number: `${item.rating}`
            })}
            color="white"
          />
          <GridItemWithTypography
            xs={4}
            content={getDate(date)}
            color="#645A59"
          />
        </Grid>
      </ListItem>
      <Divider color="black" />
    </Box>
  );
}

function GridItemWithTypography(props: GridItemWithTypographyProps) {
  return (
    <Grid item xs={props.xs}>
      <Typography variant="subtitle1" color={props.color}>
        {props.content}
      </Typography>
    </Grid>
  );
}
