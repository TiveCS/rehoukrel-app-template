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
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

const signUpWithEmailSchema = z.object({
  email: z.email(),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type SignUpWithEmailValues = z.infer<typeof signUpWithEmailSchema>;

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    validators: {
      onSubmit: signUpWithEmailSchema,
    },
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      await onSignUpWithEmail(value);
      setLoading(false);
    },
  });

  const onLoginWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
      fetchOptions: {
        onError({ error }) {
          toast.error(error.message);
        },
        onSuccess() {
          navigate({ to: "/signin" });
        },
      },
    });
  };

  const onLoginWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      fetchOptions: {
        onError({ error }) {
          toast.error(error.message);
        },
        onSuccess() {
          navigate({ to: "/signin" });
        },
      },
    });
  };

  const onSignUpWithEmail = async ({
    email,
    password,
    name,
  }: SignUpWithEmailValues) => {
    setLoading(true);
    await authClient.signUp.email({
      email,
      password,
      name,
      fetchOptions: {
        onError({ error }) {
          toast.error(error.message);
        },
        onSuccess() {
          toast.success("Account created successfully! Please sign in.");
          navigate({ to: "/signin" });
        },
      },
    });
    setLoading(false);
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
                  Sign Up with GitHub
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={onLoginWithGoogle}
                >
                  <GoogleLogo />
                  Sign Up with Google
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="John Wok"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

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
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>

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
                <Button type="submit" disabled={loading}>
                  {loading && <Spinner className="mr-2" />}
                  Sign Up
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/signin">Login</Link>
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
