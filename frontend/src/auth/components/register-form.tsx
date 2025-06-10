import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  AlertCircle,
  User,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "@/layout/components/logo";
import { useTranslation } from "@/lib/i18n";
import type { SignUpCredentials } from "../types/auth.types";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .max(50, { message: "First name must be less than 50 characters" }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .max(50, { message: "Last name must be less than 50 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Tipo inferido del esquema
type RegisterFormInputs = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { registerUser } = useAuth();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      // Extraer los datos necesarios para SignUpCredentials (omitiendo confirmPassword)
      const { confirmPassword, ...credentials } = data;

      await registerUser.mutateAsync(credentials as SignUpCredentials);

      // Limpiar el formulario
      reset();

      // Redirigir al login con un estado indicando registro exitoso
      navigate("/auth/login", {
        state: {
          registrationSuccess: true,
          email: data.email,
        },
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || t("auth.register.errors.unexpected");

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
          message: t("auth.register.errors.failed"),
        });
      }
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-0 min-h-[700px] rounded-2xl overflow-hidden shadow-2xl bg-background/50 backdrop-blur-sm border border-border/50">
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-chart-2/50 via-chart-1/20 to-chart-2/10 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-chart-3 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-chart-1 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-chart-2 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center space-y-6">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Heart className="h-12 w-12 text-chart-1" />
            <Sparkles className="h-8 w-8 text-chart-3" />
          </div>

          <h2 className="text-4xl font-bold text-foreground mb-4">
            {t("auth.register.welcome.title")}
            <span className="block text-chart-2 mt-2">
              {t("auth.register.welcome.subtitle")}
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            {t("auth.register.welcome.description")}
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
                  {t("auth.register.form.title")}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {t("auth.register.form.description")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("auth.register.form.email.label")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("auth.register.form.email.placeholder")}
                    className={cn(
                      "pl-10 h-12 transition-all duration-200",
                      "focus:ring-2 focus:ring-chart-1/20 focus:border-chart-1",
                      errors.email &&
                        "border-destructive focus:border-destructive"
                    )}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* First Name and Last Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    {t("auth.register.form.firstName.label")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder={t(
                        "auth.register.form.firstName.placeholder"
                      )}
                      className={cn(
                        "pl-10 h-12 transition-all duration-200",
                        "focus:ring-2 focus:ring-chart-1/20 focus:border-chart-1",
                        errors.firstName &&
                          "border-destructive focus:border-destructive"
                      )}
                      {...register("firstName")}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    {t("auth.register.form.lastName.label")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder={t("auth.register.form.lastName.placeholder")}
                      className={cn(
                        "pl-10 h-12 transition-all duration-200",
                        "focus:ring-2 focus:ring-chart-1/20 focus:border-chart-1",
                        errors.lastName &&
                          "border-destructive focus:border-destructive"
                      )}
                      {...register("lastName")}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("auth.register.form.password.label")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("auth.register.form.password.placeholder")}
                    className={cn(
                      "pl-10 pr-10 h-12 transition-all duration-200",
                      "focus:ring-2 focus:ring-chart-1/20 focus:border-chart-1",
                      errors.password &&
                        "border-destructive focus:border-destructive"
                    )}
                    {...register("password")}
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  {t("auth.register.form.confirmPassword.label")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t(
                      "auth.register.form.confirmPassword.placeholder"
                    )}
                    className={cn(
                      "pl-10 pr-10 h-12 transition-all duration-200",
                      "focus:ring-2 focus:ring-chart-1/20 focus:border-chart-1",
                      errors.confirmPassword &&
                        "border-destructive focus:border-destructive"
                    )}
                    {...register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Server Error Alert */}
              {(errors.root?.serverError || registerUser.isError) && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.root?.serverError?.message ||
                      (registerUser.error as any)?.response?.data?.message ||
                      t("auth.register.errors.failed")}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || registerUser.isPending}
                className={cn(
                  "w-full h-12 bg-gradient-to-r from-chart-2/90 to-chart-1/70",
                  "hover:from-chart-2/90 hover:to-chart-1/90 transition-all duration-200",
                  "text-white font-medium shadow-lg hover:shadow-xl",
                  "disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                )}
              >
                {isSubmitting || registerUser.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t("auth.register.form.registering")}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{t("auth.register.form.createAccount")}</span>
                    <UserPlus className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
                {t("auth.register.alreadyRegistered")}
              </span>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {t("auth.register.haveAccount")}{" "}
                <Link
                  to="/auth/login"
                  className="text-chart-1 hover:text-chart-1/80 font-medium transition-colors"
                >
                  {t("auth.register.signIn")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mensaje de éxito si la operación se completó correctamente (aunque redirecciona) */}
        {registerUser.isSuccess && (
          <Alert className="mt-6 border-green-200 bg-green-50 text-green-800">
            <Heart className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>{t("auth.register.success.title")}</strong>{" "}
              {t("auth.register.success.message")}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
