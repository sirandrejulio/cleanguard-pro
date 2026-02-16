import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check, Shield, Star, DollarSign } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("professional");

  const steps = [
    { num: 1, label: t("auth.signup.step1") },
    { num: 2, label: t("auth.signup.step2") },
    { num: 3, label: t("auth.signup.step3") },
  ];

  const plans = [
    { id: "trial", name: t("pricing.trial.name"), price: t("pricing.trial.price"), period: t("pricing.trial.period"), icon: Shield },
    { id: "professional", name: t("pricing.professional.name"), price: t("pricing.professional.price"), period: t("pricing.professional.period"), icon: Star, popular: true },
    { id: "enterprise", name: t("pricing.enterprise.name"), price: t("pricing.enterprise.price"), period: t("pricing.enterprise.period"), icon: DollarSign },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);

    try {
      // 1. Criar user no Supabase Auth
      const { error, user } = await signUp(email, password, {
        full_name: fullName,
      });

      if (error) {
        if (error.message?.includes("already registered")) {
          toast({ variant: "destructive", title: t("auth.signup.errors.emailTaken") });
        } else {
          toast({ variant: "destructive", title: t("auth.signup.errors.generic") });
        }
        setLoading(false);
        return;
      }

      if (user) {
        // 2. Chamar edge function para criar company + profile + role (usa service_role_key)
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;

        if (token) {
          const response = await supabase.functions.invoke("complete-onboarding", {
            body: {
              company_name: companyName,
              phone: phone,
              selected_plan: selectedPlan,
              full_name: fullName,
            },
          });

          if (response.error) {
            console.error("Onboarding error:", response.error);
            // Não falhar silenciosamente — dados podem ter sido parcialmente criados
            toast({
              variant: "destructive",
              title: "Onboarding setup had issues. Please contact support.",
            });
          }
        }
      }

      setShowSuccess(true);
    } catch {
      toast({ variant: "destructive", title: t("auth.signup.errors.generic") });
    }

    setLoading(false);
  };

  if (showSuccess) {
    return (
      <AuthLayout>
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border border-primary/30 bg-primary/10 mx-auto flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-black">{t("auth.signup.success.title")}</h2>
          <p className="text-muted-foreground">{t("auth.signup.success.message")}</p>
          <Link to="/login">
            <button className="border border-border text-foreground text-xs font-bold tracking-wider uppercase px-8 py-3 hover:border-primary hover:bg-primary/5 transition-all duration-300">
              {t("auth.login.submit")}
            </button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  const inputClass =
    "w-full h-12 bg-secondary border border-border text-foreground text-base px-4 placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors";

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-black">{t("auth.signup.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.signup.subtitle")}</p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center text-sm font-bold border transition-colors ${
                  step >= s.num
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`text-[10px] font-mono tracking-wider uppercase hidden sm:block ${
                  step >= s.num ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${step > s.num ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label htmlFor="fullName" className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                  {t("auth.signup.fullName")}
                </label>
                <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputClass} placeholder="John Smith" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                  {t("auth.signup.email")}
                </label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                  {t("auth.signup.password")}
                </label>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">{t("auth.signup.passwordHint")}</p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <label htmlFor="companyName" className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                  {t("auth.signup.companyName")}
                </label>
                <input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className={inputClass} placeholder="SparkleClean LLC" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                  {t("auth.signup.phone")}
                </label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder={t("auth.signup.phonePlaceholder")} />
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <label className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                {t("auth.signup.selectPlan")}
              </label>
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full flex items-center gap-4 p-4 border text-left transition-all duration-200 ${
                    selectedPlan === plan.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30 bg-secondary/50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                      selectedPlan === plan.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <plan.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold">{plan.name}</span>
                      {plan.popular && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5">
                          {t("pricing.professional.popular")}
                        </span>
                      )}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      <span className="font-display font-black text-foreground text-lg">{plan.price}</span>
                      <span className="ml-1">{plan.period}</span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 border flex items-center justify-center shrink-0 ${
                      selectedPlan === plan.id ? "border-primary bg-primary" : "border-border"
                    }`}
                  >
                    {selectedPlan === plan.id && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 h-12 border border-border text-foreground text-sm font-bold tracking-wider uppercase hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("auth.signup.back")}
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-primary text-primary-foreground font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center"
            >
              {step < 3 ? t("auth.signup.next") : loading ? t("auth.signup.submitting") : t("auth.signup.submit")}
              {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t("auth.signup.hasAccount")} </span>
          <Link to="/login" className="text-primary font-semibold hover:underline">
            {t("auth.signup.signIn")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
