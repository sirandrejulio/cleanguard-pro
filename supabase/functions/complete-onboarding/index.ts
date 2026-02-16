import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Autenticação do usuário que acabou de fazer signup
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Invalid or expired token");
    }

    const { company_name, phone, selected_plan, full_name } = await req.json();

    if (!company_name || !full_name) {
      throw new Error("company_name and full_name are required");
    }

    // Verificar se o user já tem uma company (evitar duplicação)
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, company_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingProfile?.company_id) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "User already has a company",
          company_id: existingProfile.company_id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Criar company
    const { data: company, error: companyError } = await supabaseAdmin
      .from("companies")
      .insert({
        name: company_name,
        owner_id: user.id,
        phone: phone || null,
        subscription_tier: selected_plan || "trial",
        subscription_status: "active",
        shield_enabled: true,
        route_enabled: true,
        fill_enabled: true,
      })
      .select()
      .single();

    if (companyError) {
      console.error("Company creation error:", companyError);
      throw new Error(`Failed to create company: ${companyError.message}`);
    }

    // 2. Criar ou atualizar profile
    if (existingProfile) {
      // Atualizar profile existente com company_id
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          company_id: company.id,
          full_name: full_name,
          phone: phone || null,
          role: "admin",
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
      }
    } else {
      // Criar profile novo
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert({
          user_id: user.id,
          email: user.email || "",
          full_name: full_name,
          phone: phone || null,
          company_id: company.id,
          role: "admin",
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Rollback: deletar company
        await supabaseAdmin.from("companies").delete().eq("id", company.id);
        throw new Error(`Failed to create profile: ${profileError.message}`);
      }
    }

    // 3. Criar user_role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: user.id,
        role: "admin",
      });

    if (roleError && !roleError.message?.includes("duplicate")) {
      console.error("Role creation error:", roleError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        company: {
          id: company.id,
          name: company.name,
          subscription_tier: company.subscription_tier,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Onboarding error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
