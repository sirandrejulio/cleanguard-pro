import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Página de redefinição de senha — design STRATA escuro
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

  const inputClass = "w-full h-12 bg-white/5 border border-white/10 text-white text-base px-4 placeholder:text-zinc-600 focus:outline-none focus:border-brand-emerald transition-colors";

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border border-brand-emerald/30 bg-brand-emerald/10 mx-auto flex items-center justify-center">
            <Check className="w-8 h-8 text-brand-emerald" />
          </div>
          <h2 className="font-display text-2xl font-black text-white">{t("auth.resetPassword.success.title")}</h2>
          <p className="text-zinc-400">{t("auth.resetPassword.success.message")}</p>
          <Link to="/login">
            <button className="bg-brand-emerald text-black font-bold text-sm tracking-wider uppercase px-8 py-3 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300">
              {t("auth.login.submit")}
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
          <h1 className="font-display text-3xl font-black text-white">{t("auth.resetPassword.title")}</h1>
          <p className="text-zinc-400 mt-2">{t("auth.resetPassword.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="password" className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
              {t("auth.resetPassword.password")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
              {t("auth.resetPassword.confirmPassword")}
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-brand-emerald text-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center"
          >
            {loading ? t("auth.resetPassword.submitting") : t("auth.resetPassword.submit")}
            {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
