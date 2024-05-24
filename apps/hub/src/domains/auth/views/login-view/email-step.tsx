import * as LoginForm from "@/domains/auth/forms/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Flex,
  MutedText,
} from "@rivet-gg/components";

interface EmailStepProps {
  onSubmit: LoginForm.SubmitHandler;
}

export const EmailStep = ({ onSubmit }: EmailStepProps) => {
  return (
    <LoginForm.Form defaultValues={{ email: "" }} onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Flex gap="4" direction="col">
            <LoginForm.Email />
            <LoginForm.Captcha />
            <MutedText>
              By clicking Continue, you agree to the Rivet Terms of Service and
              Privacy Policy.
            </MutedText>
          </Flex>
        </CardContent>
        <CardFooter>
          <LoginForm.Submit w="full">Continue</LoginForm.Submit>
        </CardFooter>
      </Card>
    </LoginForm.Form>
  );
};
