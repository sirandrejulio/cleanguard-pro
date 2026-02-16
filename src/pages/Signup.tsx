import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check, Shield, Star, DollarSign } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Página de Signup — design STRATA escuro com steps e seleção de plano
const Signup = () => {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Dados do formulário
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
    {
      id: "trial",
      name: t("pricing.trial.name"),
      price: t("pricing.trial.price"),
      period: t("pricing.trial.period"),
      icon: Shield,
    },
    {
      id: "professional",
      name: t("pricing.professional.name"),
      price: t("pricing.professional.price"),
      period: t("pricing.professional.period"),
      icon: Star,
      popular: true,
    },
    {
      id: "enterprise",
      name: t("pricing.enterprise.name"),
      price: t("pricing.enterprise.price"),
      period: t("pricing.enterprise.period"),
      icon: DollarSign,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);

    try {
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
        // Criar empresa
        const { data: company } = await supabase
          .from("companies")
          .insert({
            name: companyName,
            owner_id: user.id,
            phone: phone,
            subscription_tier: selectedPlan,
          })
          .select()
          .single();

        // Criar perfil
        await supabase.from("profiles").insert({
          user_id: user.id,
          email: email,
          full_name: fullName,
          phone: phone,
          company_id: company?.id,
          role: "admin",
        });

        // Criar role
        await supabase.from("user_roles").insert({
          user_id: user.id,
          role: "admin" as any,
        });
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
          <div className="w-16 h-16 border border-brand-emerald/30 bg-brand-emerald/10 mx-auto flex items-center justify-center">
            <Check className="w-8 h-8 text-brand-emerald" />
          </div>
          <h2 className="font-display text-2xl font-black text-white">{t("auth.signup.success.title")}</h2>
          <p className="text-zinc-400">{t("auth.signup.success.message")}</p>
          <Link to="/login">
            <button className="border border-white/10 text-white text-xs font-bold tracking-wider uppercase px-8 py-3 hover:border-white/30 hover:bg-white/5 transition-all duration-300">
              {t("auth.login.submit")}
            </button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Estilo de input STRATA reutilizável
  const inputClass = "w-full h-12 bg-white/5 border border-white/10 text-white text-base px-4 placeholder:text-zinc-600 focus:outline-none focus:border-brand-emerald transition-colors";

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-black text-white">{t("auth.signup.title")}</h1>
          <p className="text-zinc-400 mt-2">{t("auth.signup.subtitle")}</p>
        </div>

        {/* Indicador de etapas */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center text-sm font-bold border transition-colors ${
                  step >= s.num
                    ? "bg-brand-emerald text-black border-brand-emerald"
                    : "border-white/10 text-zinc-500"
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-[10px] font-mono tracking-wider uppercase hidden sm:block ${
                step >= s.num ? "text-white" : "text-zinc-600"
              }`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${step > s.num ? "bg-brand-emerald" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Etapa 1: Conta */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label htmlFor="fullName" className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
                  {t("auth.signup.fullName")}
                </label>
                <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputClass} placeholder="John Smith" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
                  {t("auth.signup.email")}
                </label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
                  {t("auth.signup.password")}
                </label>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className={`${inputClass} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-zinc-600">{t("auth.signup.passwordHint")}</p>
              </div>
            </>
          )}

          {/* Etapa 2: Empresa */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <label htmlFor="companyName" className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
                  {t("auth.signup.companyName")}
                </label>
                <input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className={inputClass} placeholder="SparkleClean LLC" />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
                  {t("auth.signup.phone")}
                </label>
                <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder={t("auth.signup.phonePlaceholder")} />
              </div>
            </>
          )}

          {/* Etapa 3: Seleção de plano */}
          {step === 3 && (
            <div className="space-y-3">
              <label className="font-mono text-[11px] tracking-[0.2em] text-zinc-500 uppercase">
                {t("auth.signup.selectPlan")}
              </label>
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full flex items-center gap-4 p-4 border text-left transition-all duration-200 ${
                    selectedPlan === plan.id
                      ? "border-brand-emerald bg-brand-emerald/5"
                      : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                    selectedPlan === plan.id ? "bg-brand-emerald text-black" : "bg-white/5 text-zinc-500"
                  }`}>
                    <plan.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-white">{plan.name}</span>
                      {plan.popular && (
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-emerald bg-brand-emerald/10 px-2 py-0.5">
                          {t("pricing.professional.popular")}
                        </span>
                      )}
                    </div>
                    <div className="text-zinc-500 text-sm">
                      <span className="font-display font-black text-white text-lg">{plan.price}</span>
                      <span className="ml-1">{plan.period}</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 border flex items-center justify-center shrink-0 ${
                    selectedPlan === plan.id ? "border-brand-emerald bg-brand-emerald" : "border-white/10"
                  }`}>
                    {selectedPlan === plan.id && <Check className="w-3 h-3 text-black" />}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Botões de navegação */}
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 h-12 border border-white/10 text-white text-sm font-bold tracking-wider uppercase hover:border-white/30 hover:bg-white/5 transition-all duration-300 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("auth.signup.back")}
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 bg-brand-emerald text-black font-bold text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center"
            >
              {step < 3
                ? t("auth.signup.next")
                : loading
                  ? t("auth.signup.submitting")
                  : t("auth.signup.submit")}
              {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center text-sm">
          <span className="text-zinc-500">{t("auth.signup.hasAccount")} </span>
          <Link to="/login" className="text-brand-emerald font-semibold hover:underline">
            {t("auth.signup.signIn")}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
