import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
      // Redireciona para /dashboard que faz RoleRedirect automático
      navigate("/dashboard");
    }

    setLoading(false);
  };

  const inputClass =
    "w-full h-12 bg-secondary border border-border text-foreground text-base px-4 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors";

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-black">{t("auth.login.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.login.subtitle")}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              {t("auth.login.email")}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="you@company.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                {t("auth.login.password")}
              </label>
              <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">
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
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-primary-foreground font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center"
          >
            {loading ? t("auth.login.submitting") : t("auth.login.submit")}
            {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t("auth.login.noAccount")} </span>
          <Link to="/signup" className="text-primary font-semibold hover:underline">
            {t("auth.login.signUp")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
