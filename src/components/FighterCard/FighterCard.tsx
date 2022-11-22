import { Card, CardContent, List } from "@mui/material";
import React from "react";
import cardBackground from "../../backgrounds/card_background.jpg";

interface FighterCardProps {
  children: React.ReactNode;
}

function FighterCard({ children }: FighterCardProps) {
  return (
    <Card
      sx={{
        mt: "0",
        borderRadius: "15px",
        padding: "10px",
        boxShadow:
          "2px 2px 5px 3px rgb(0 0 0 / 50%), -2px -2px 5px 3px rgb(0 0 0 / 50%)",
        mb: 5,
        ml: 5,
        width: "100%",
        backgroundImage: `url('${cardBackground}')`,
        maxWidth: 800,
      }}>
      <CardContent>
        <List>{children}</List>
      </CardContent>
    </Card>
  );
}

export default FighterCard;
