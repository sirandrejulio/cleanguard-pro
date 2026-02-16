import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const { t } = useTranslation();
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Passwords do not match" });
      return;
    }

    if (password.length < 8) {
      toast({ variant: "destructive", title: t("auth.signup.errors.weakPassword") });
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(password);

    if (error) {
      toast({ variant: "destructive", title: t("auth.login.errors.generic") });
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-success/10 border-2 border-success mx-auto flex items-center justify-center">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-display text-2xl font-black">{t("auth.resetPassword.success.title")}</h2>
          <p className="text-muted-foreground">{t("auth.resetPassword.success.message")}</p>
          <Link to="/login">
            <Button className="font-bold">{t("auth.login.submit")}</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl font-black">{t("auth.resetPassword.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.resetPassword.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="font-semibold text-sm uppercase tracking-wider">
              {t("auth.resetPassword.password")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-12 border-2 text-base pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="font-semibold text-sm uppercase tracking-wider">
              {t("auth.resetPassword.confirmPassword")}
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="h-12 border-2 text-base"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base font-bold group" disabled={loading}>
            {loading ? t("auth.resetPassword.submitting") : t("auth.resetPassword.submit")}
            {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
