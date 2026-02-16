import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Página de recuperação de senha — design STRATA escuro
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
          <div className="w-16 h-16 border border-brand-emerald/30 bg-brand-emerald/10 mx-auto flex items-center justify-center">
            <Check className="w-8 h-8 text-brand-emerald" />
          </div>
          <h2 className="font-display text-2xl font-black text-white">{t("auth.forgotPassword.success.title")}</h2>
          <p className="text-zinc-400">{t("auth.forgotPassword.success.message")}</p>
          <Link to="/login">
            <button className="border border-white/10 text-white text-xs font-bold tracking-wider uppercase px-8 py-3 hover:border-white/30 hover:bg-white/5 transition-all duration-300 inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t("auth.forgotPassword.backToLogin")}
            </button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl font-black text-white">{t("auth.forgotPassword.title")}</h1>
          <p className="text-zinc-400 mt-2">{t("auth.forgotPassword.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
              {t("auth.forgotPassword.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 bg-white/5 border border-white/10 text-white text-base px-4 placeholder:text-zinc-600 focus:outline-none focus:border-brand-emerald transition-colors"
              placeholder="you@company.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-brand-emerald text-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center"
          >
            {loading ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
            {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-sm text-brand-emerald font-semibold hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            {t("auth.forgotPassword.backToLogin")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
