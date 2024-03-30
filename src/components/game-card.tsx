import { Rivet } from "@rivet-gg/api";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Link } from "@tanstack/react-router";
import { Text } from "./ui/typography";

interface GameCardProps extends Rivet.game.Summary {}

export function GameCard({ displayName, gameId, logoUrl }: GameCardProps) {
  return (
    <Link to="/games/$gameId" params={{ gameId }}>
      <Card>
        <CardContent className="pt-6">
          <img
            src={
              logoUrl || "https://assets2.rivet.gg/games/blank/blankgame.svg"
            }
            className="w-24 h-24 mx-auto object-contain"
            alt=""
          />
        </CardContent>
        <CardFooter className="justify-center">
          <Text>{displayName}</Text>
        </CardFooter>
      </Card>
    </Link>
  );
}