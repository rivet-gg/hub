import { Feedback } from "@/domains/auth/components/feedback";
import { Link } from "@rivet-gg/components";
import type { ReactNode } from "react";
import { Header as UiHeader } from "../components/header";

interface RootProps {
  children: ReactNode;
}

const Root = ({ children }: RootProps) => {
  return <div className="flex min-h-screen flex-col">{children}</div>;
};

const Main = ({ children }: RootProps) => {
  return <main className="bg-background flex flex-1 flex-col">{children}</main>;
};

const Header = () => {
  return <UiHeader />;
};

const Footer = () => {
  return (
    <footer className="text-muted-foreground bg-background p-4 text-center text-sm">
      <div className="container">
        <Link href="https://old.rivet.gg" target="_blank" rel="noreferrer">
          Old Version
        </Link>{" "}
        &bull;{" "}
        <Link href="https://rivet.gg/support" target="_blank" rel="noreferrer">
          Support
        </Link>
        <p>
          &copy; {new Date().getFullYear()} Rivet Gaming, Inc. All rights
          reserved
        </p>
      </div>
    </footer>
  );
};

export { Root, Main, Header, Footer };
