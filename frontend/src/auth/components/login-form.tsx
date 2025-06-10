import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuth } from "../hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Heart,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/layout/components/logo";
import { useTranslation } from "@/lib/i18n";

interface SignInCredentials {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const registrationSuccess = location.state?.registrationSuccess;

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<SignInCredentials>();

  const { signIn } = useAuth();

  const onSubmit: SubmitHandler<SignInCredentials> = async (data) => {
    try {
      await signIn.mutateAsync(data);

      reset();
      setShowPassword(false);

      navigate(from, { replace: true });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || t("auth.login.errors.unexpected");

      if (typeof errorMessage === "string") {
        setError("root.serverError", { type: "manual", message: errorMessage });
      } else if (Array.isArray(errorMessage)) {
        setError("root.serverError", {
          type: "manual",
          message: errorMessage.join(", "),
        });
      } else {
        setError("root.serverError", {
          type: "manual",
          message: t("auth.login.errors.failed"),
        });
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-0 min-h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-background/50 backdrop-blur-sm border border-border/50">
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-chart-3/50 via-chart-2/20 to-chart-3/10 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-chart-1 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-chart-2 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-chart-3 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center space-y-6">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Heart className="h-12 w-12 text-chart-1" />
            <Sparkles className="h-8 w-8 text-chart-2" />
          </div>

          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t("auth.login.welcome.title")}
            <span className="block text-chart-1 mt-2">
              {t("auth.login.welcome.subtitle")}
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t("auth.login.welcome.description")}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center p-8 lg:p-12">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo size="xl" className="text-chart-1" />
              <div>
                <CardTitle className="text-2xl font-bold">
                  {t("auth.login.form.title")}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {t("auth.login.form.description")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          {registrationSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
              <Heart className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>{t("auth.login.registrationSuccess.title")}</strong>{" "}
                {t("auth.login.registrationSuccess.message")}
              </AlertDescription>
            </Alert>
          )}

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("auth.login.form.email.label")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.login.form.email.placeholder")}
                    className={cn(
                      "pl-10 h-12 transition-all duration-200",
                      "focus:ring-2 focus:ring-chart-1/20 focus:border-chart-1",
                      errors.email &&
                        "border-destructive focus:border-destructive"
                    )}
                    {...register("email", {
                      required: t("auth.login.form.email.required"),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t("auth.login.form.email.invalid"),
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("auth.login.form.password.label")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.login.form.password.placeholder")}
                    className={cn(
                      "pl-10 pr-10 h-12 transition-all duration-200",
                      "focus:ring-2 focus:ring-chart-1/20 focus:border-chart-1",
                      errors.password &&
                        "border-destructive focus:border-destructive"
                    )}
                    {...register("password", {
                      required: t("auth.login.form.password.required"),
                      minLength: {
                        value: 6,
                        message: t("auth.login.form.password.minLength"),
                      },
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {(errors.root?.serverError || signIn.isError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.root?.serverError?.message ||
                      (signIn.error as any)?.response?.data?.message ||
                      t("auth.login.errors.credentials")}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isSubmitting || signIn.isPending}
                className={cn(
                  "w-full h-12 bg-gradient-to-r from-chart-3/90 to-chart-2/70",
                  "hover:from-chart-3/90 hover:to-chart-2/90 transition-all duration-200",
                  "text-white font-medium shadow-lg hover:shadow-xl",
                  "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                )}
              >
                {isSubmitting || signIn.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t("auth.login.form.signingIn")}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{t("auth.login.form.signIn")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
                {t("auth.login.newToResilire")}
              </span>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t("auth.login.noAccount")}{" "}
                <Link
                  to="/auth/register"
                  className="text-chart-1 hover:text-chart-1/80 font-medium transition-colors"
                >
                  {t("auth.login.createAccount")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {signIn.isSuccess && (
          <Alert className="mt-6 border-green-200 bg-green-50 text-green-800">
            <Heart className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>{t("auth.login.success.title")}</strong>{" "}
              {t("auth.login.success.message")}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
