import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useCompany } from "@/hooks/useCompany";
import { Loader2 } from "lucide-react";

interface SubscriptionGuardProps {
    children: ReactNode;
    requiredTier?: "basic" | "pro" | "enterprise";
    requiredModule?: "shield" | "route" | "fill";
}

export function SubscriptionGuard({ children, requiredTier = "basic", requiredModule }: SubscriptionGuardProps) {
    const { data: company, isLoading } = useCompany();

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!company) {
        return <Navigate to="/dashboard" replace />;
    }

    // 1. Check Module Trigger
    if (requiredModule) {
        const moduleKey = `${requiredModule}_enabled` as keyof typeof company;
        if (!company[moduleKey]) {
            // Se módulo desativado, redireciona para settings
            return <Navigate to="/dashboard/settings" replace />;
        }
    }

    // 2. Check Tier Level 
    // (Simplificação: Enterprise > Pro > Basic > Trial)
    // Se for 'trial', permitimos tudo por enquanto para teste, ou bloqueamos?
    // O usuário pediu "Simular plano Pro sem pagamento" -> DEVE BLOQUEAR se não for pago.
    // Mas como não temos pagamento real integrado, vou assumir que 'trial' = basic features apenas?
    // Ou melhor: se tier for null, assume basic.

    const TIER_LEVELS = {
        basic: 0,
        trial: 1, // Trial geralmente dá acesso a tudo ou quase tudo? Vamos assumir que Trial = Pro para teste.
        pro: 2,
        enterprise: 3
    };

    const userTier = company.subscription_tier || "basic";
    // Normalizing "trial" to be powerful for now, or restrictive? 
    // O user disse: "Simular plano Pro sem pagamento" -> Isso é um problema.
    // Se "Trial" for o default, então o user tem Pro de graça.
    // Vamos tratar 'trial' como nível 1 (acima de basic, mas abaixo de pro se quisermos limitar tempo).
    // Para fins de auditoria, vamos exigir que o tier correspondente exista.

    // Mapeamento real:
    // Se require 'pro', user precisa ser 'pro' ou 'enterprise'. (Trial pode ser discutível).

    const currentLevel = TIER_LEVELS[userTier as keyof typeof TIER_LEVELS] || 0;
    const requiredLevel = TIER_LEVELS[requiredTier] || 0;

    if (currentLevel < requiredLevel) {
        return <Navigate to="/dashboard/settings?tab=subscription&upgrade=true" replace />;
    }

    return <>{children}</>;
}
