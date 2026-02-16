import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Página de Login — design STRATA escuro com inputs transparentes
const Login = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: t("auth.login.errors.invalid"),
      });
    } else {
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-black text-white">{t("auth.login.title")}</h1>
          <p className="text-zinc-400 mt-2">{t("auth.login.subtitle")}</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
              {t("auth.login.email")}
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
                {t("auth.login.password")}
              </label>
              <Link to="/forgot-password" className="text-xs text-brand-emerald font-medium hover:underline">
                {t("auth.login.forgotPassword")}
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-12 bg-white/5 border border-white/10 text-white text-base px-4 pr-12 placeholder:text-zinc-600 focus:outline-none focus:border-brand-emerald transition-colors"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-brand-emerald text-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center"
          >
            {loading ? t("auth.login.submitting") : t("auth.login.submit")}
            {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm">
          <span className="text-zinc-500">{t("auth.login.noAccount")} </span>
          <Link to="/signup" className="text-brand-emerald font-semibold hover:underline">
            {t("auth.login.signUp")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
