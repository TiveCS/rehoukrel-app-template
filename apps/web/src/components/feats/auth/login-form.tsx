import { GitHubLogo } from "@/components/logo/github-logo";
import { GoogleLogo } from "@/components/logo/google-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { authClient } from "@/lib/auth";

const loginWithEmailSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

type LoginWithEmailValues = z.infer<typeof loginWithEmailSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm({
    validators: {
      onSubmit: loginWithEmailSchema,
    },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await onLoginWithEmail(value);
    },
  });

  const onLoginWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
    });
  };

  const onLoginWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const onLoginWithEmail = async ({
    email,
    password,
  }: LoginWithEmailValues) => {
    console.log({ email, password });

    const result = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/app",
      rememberMe: false,
    });

    console.log(result);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onLoginWithGithub}
                >
                  <GitHubLogo />
                  Login with GitHub
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onLoginWithGoogle}
                >
                  <GoogleLogo />
                  Login with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="johnwok@gmail.com"
                        autoComplete="off"
                        type="email"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center">
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                        <Link
                          to="/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>

                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="*********"
                        type="password"
                        autoComplete="off"
                        required
                      />
                    </Field>
                  );
                }}
              </form.Field>

              <Field>
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link to="/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <Link to="/terms">Terms of Service</Link> and{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}
