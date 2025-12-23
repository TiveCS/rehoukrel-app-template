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
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const loginWithEmailSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

type LoginWithEmailValues = z.infer<typeof loginWithEmailSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    validators: {
      onSubmit: loginWithEmailSchema,
    },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      await onLoginWithEmail(value);
      setLoading(false);
    },
  });

  const onLoginWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: `${window.location.origin}/home`,
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    });
  };

  const onLoginWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/home`,
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    });
  };

  const onLoginWithEmail = async ({
    email,
    password,
  }: LoginWithEmailValues) => {
    await authClient.signIn.email({
      email,
      password,
      rememberMe: false,
      callbackURL: `${window.location.origin}/home`,
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    });
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
                          tabIndex={-1}
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

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <Field>
                <Button type="submit" disabled={loading}>
                  {loading && <Spinner className="mr-2" />}
                  Login
                </Button>
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
