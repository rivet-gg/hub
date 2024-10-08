import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Text,
} from "@rivet-gg/components";
import { Icon, faFlagCheckered } from "@rivet-gg/icons";
import { Link } from "@tanstack/react-router";

export const NotFoundComponent = () => {
  return (
    <Card w="full">
      <CardHeader>
        <CardTitle className="flex gap-2">
          <Icon icon={faFlagCheckered} />
          Wrong direction!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Text>This page does not exists!</Text>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link to="/">Homepage</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
