import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      toast({ variant: "destructive", title: t("auth.login.errors.generic") });
    } else {
      setSent(true);
    }

    setLoading(false);
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-success/10 border-2 border-success mx-auto flex items-center justify-center">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-display text-2xl font-black">{t("auth.forgotPassword.success.title")}</h2>
          <p className="text-muted-foreground">{t("auth.forgotPassword.success.message")}</p>
          <Link to="/login">
            <Button variant="outline" className="border-2 font-semibold">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("auth.forgotPassword.backToLogin")}
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl font-black">{t("auth.forgotPassword.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.forgotPassword.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold text-sm uppercase tracking-wider">
              {t("auth.forgotPassword.email")}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 border-2 text-base"
              placeholder="you@company.com"
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base font-bold group" disabled={loading}>
            {loading ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
            {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
          </Button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-sm text-primary font-semibold hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            {t("auth.forgotPassword.backToLogin")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
