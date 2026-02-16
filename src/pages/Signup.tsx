import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check, Shield, MapPin, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  // Form data
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
          <div className="w-16 h-16 bg-success/10 border-2 border-success mx-auto flex items-center justify-center">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="font-display text-2xl font-black">{t("auth.signup.success.title")}</h2>
          <p className="text-muted-foreground">{t("auth.signup.success.message")}</p>
          <Link to="/login">
            <Button variant="outline" className="border-2 font-semibold">
              {t("auth.login.submit")}
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="font-display text-3xl font-black">{t("auth.signup.title")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.signup.subtitle")}</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  step >= s.num
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider hidden sm:block ${
                step >= s.num ? "text-foreground" : "text-muted-foreground"
              }`}>
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
          {/* Step 1: Account */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName" className="font-semibold text-sm uppercase tracking-wider">
                  {t("auth.signup.fullName")}
                </Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-12 border-2 text-base"
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-sm uppercase tracking-wider">
                  {t("auth.signup.email")}
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
              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold text-sm uppercase tracking-wider">
                  {t("auth.signup.password")}
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
                <p className="text-xs text-muted-foreground">{t("auth.signup.passwordHint")}</p>
              </div>
            </>
          )}

          {/* Step 2: Company */}
          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName" className="font-semibold text-sm uppercase tracking-wider">
                  {t("auth.signup.companyName")}
                </Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  className="h-12 border-2 text-base"
                  placeholder="SparkleClean LLC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-semibold text-sm uppercase tracking-wider">
                  {t("auth.signup.phone")}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 border-2 text-base"
                  placeholder={t("auth.signup.phonePlaceholder")}
                />
              </div>
            </>
          )}

          {/* Step 3: Plan Selection */}
          {step === 3 && (
            <div className="space-y-3">
              <Label className="font-semibold text-sm uppercase tracking-wider">
                {t("auth.signup.selectPlan")}
              </Label>
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full flex items-center gap-4 p-4 border-2 text-left transition-colors ${
                    selectedPlan === plan.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                    selectedPlan === plan.id ? "bg-primary text-primary-foreground" : "bg-secondary"
                  }`}>
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
                  <div className={`w-5 h-5 border-2 flex items-center justify-center shrink-0 ${
                    selectedPlan === plan.id ? "border-primary bg-primary" : "border-border"
                  }`}>
                    {selectedPlan === plan.id && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 border-2 font-semibold"
                onClick={() => setStep(step - 1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("auth.signup.back")}
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1 h-12 text-base font-bold group"
              disabled={loading}
            >
              {step < 3
                ? t("auth.signup.next")
                : loading
                  ? t("auth.signup.submitting")
                  : t("auth.signup.submit")}
              {!loading && <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />}
            </Button>
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
