import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, BarChart3, Percent } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function PricingEnginePage() {
  const { t } = useTranslation();

  const { data: jobs = [] } = useQuery({
    queryKey: ["pricing-jobs"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("service_type, quoted_price, final_price, status");
      return data || [];
    },
  });

  // Pricing analytics by service type
  const serviceMap: Record<string, { total: number; revenue: number; count: number }> = {};
  jobs.forEach((j) => {
    if (!serviceMap[j.service_type]) {
      serviceMap[j.service_type] = { total: 0, revenue: 0, count: 0 };
    }
    serviceMap[j.service_type].count++;
    serviceMap[j.service_type].total += Number(j.quoted_price) || 0;
    serviceMap[j.service_type].revenue += Number(j.final_price) || Number(j.quoted_price) || 0;
  });

  const chartData = Object.entries(serviceMap).map(([service, data]) => ({
    name: service.replace(/_/g, " "),
    avgPrice: data.count > 0 ? Math.round(data.total / data.count) : 0,
    avgRevenue: data.count > 0 ? Math.round(data.revenue / data.count) : 0,
    jobs: data.count,
  }));

  const totalQuoted = jobs.reduce((s, j) => s + (Number(j.quoted_price) || 0), 0);
  const totalFinal = jobs.reduce((s, j) => s + (Number(j.final_price) || Number(j.quoted_price) || 0), 0);
  const avgJobPrice = jobs.length > 0 ? Math.round(totalQuoted / jobs.length) : 0;
  const marginPercent = totalQuoted > 0 ? Math.round(((totalFinal - totalQuoted) / totalQuoted) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-black">{t("fillModule.pricing.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("fillModule.pricing.subtitle")}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card border-2 border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.pricing.totalQuoted")}</span>
          </div>
          <p className="font-display text-2xl font-black">${totalQuoted.toLocaleString()}</p>
        </div>
        <div className="bg-card border-2 border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.pricing.totalRevenue")}</span>
          </div>
          <p className="font-display text-2xl font-black">${totalFinal.toLocaleString()}</p>
        </div>
        <div className="bg-card border-2 border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.pricing.avgPrice")}</span>
          </div>
          <p className="font-display text-2xl font-black">${avgJobPrice}</p>
        </div>
        <div className="bg-card border-2 border-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("fillModule.pricing.margin")}</span>
          </div>
          <p className={`font-display text-2xl font-black ${marginPercent >= 0 ? "text-emerald-600" : "text-destructive"}`}>
            {marginPercent >= 0 ? "+" : ""}{marginPercent}%
          </p>
        </div>
      </div>

      {/* Price by Service Chart */}
      <div className="bg-card border-2 border-border">
        <div className="p-4 border-b-2 border-border">
          <h2 className="font-display font-bold">{t("fillModule.pricing.byService")}</h2>
        </div>
        <div className="p-4 h-72">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "2px solid hsl(var(--border))",
                    borderRadius: 0,
                  }}
                />
                <Bar dataKey="avgPrice" fill="hsl(var(--primary))" name={t("fillModule.pricing.avgQuoted")} />
                <Bar dataKey="avgRevenue" fill="hsl(var(--chart-2))" name={t("fillModule.pricing.avgFinal")} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {t("analytics.noData")}
            </div>
          )}
        </div>
      </div>

      {/* Service Breakdown Table */}
      <div className="bg-card border-2 border-border">
        <div className="p-4 border-b-2 border-border">
          <h2 className="font-display font-bold">{t("fillModule.pricing.breakdown")}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-3 font-bold uppercase text-xs tracking-widest text-muted-foreground">{t("fillModule.pricing.service")}</th>
                <th className="text-right p-3 font-bold uppercase text-xs tracking-widest text-muted-foreground">{t("fillModule.pricing.jobCount")}</th>
                <th className="text-right p-3 font-bold uppercase text-xs tracking-widest text-muted-foreground">{t("fillModule.pricing.avgQuoted")}</th>
                <th className="text-right p-3 font-bold uppercase text-xs tracking-widest text-muted-foreground">{t("fillModule.pricing.avgFinal")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {chartData.map((row) => (
                <tr key={row.name} className="hover:bg-accent transition-colors">
                  <td className="p-3 font-semibold capitalize">{row.name}</td>
                  <td className="p-3 text-right">{row.jobs}</td>
                  <td className="p-3 text-right">${row.avgPrice}</td>
                  <td className="p-3 text-right">${row.avgRevenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
