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

    // Verificar que o chamador é owner
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) throw new Error("Unauthorized");

    // Checar role do chamador
    const { data: callerRole } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "owner")
      .maybeSingle();

    if (!callerRole) {
      throw new Error("Only OWNER can manage companies");
    }

    const { action, ...params } = await req.json();

    switch (action) {
      case "create": {
        const { company_name, admin_email, admin_name, subscription_tier } = params;

        if (!company_name || !admin_email || !admin_name) {
          throw new Error("company_name, admin_email, and admin_name are required");
        }

        // 1. Criar company
        const { data: company, error: companyError } = await supabaseAdmin
          .from("companies")
          .insert({
            name: company_name,
            owner_id: user.id,
            subscription_tier: subscription_tier || "trial",
            subscription_status: "active",
            shield_enabled: true,
            route_enabled: true,
            fill_enabled: true,
          })
          .select()
          .single();

        if (companyError) throw new Error(`Company creation failed: ${companyError.message}`);

        // 2. Criar admin user via Auth
        const tempPassword = generatePassword(16);
        const { data: authUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
          email: admin_email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { full_name: admin_name },
        });

        if (createUserError) {
          // Rollback company
          await supabaseAdmin.from("companies").delete().eq("id", company.id);
          throw new Error(`User creation failed: ${createUserError.message}`);
        }

        // 3. Criar profile
        const { error: profileError } = await supabaseAdmin.from("profiles").insert({
          user_id: authUser.user.id,
          email: admin_email,
          full_name: admin_name,
          company_id: company.id,
          role: "admin",
        });

        if (profileError) {
          await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
          await supabaseAdmin.from("companies").delete().eq("id", company.id);
          throw new Error(`Profile creation failed: ${profileError.message}`);
        }

        // 4. Criar role
        await supabaseAdmin.from("user_roles").insert({
          user_id: authUser.user.id,
          role: "admin",
        });

        return new Response(
          JSON.stringify({
            success: true,
            company: { id: company.id, name: company.name },
            admin: { id: authUser.user.id, email: admin_email, temp_password: tempPassword },
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "suspend": {
        const { company_id } = params;
        if (!company_id) throw new Error("company_id is required");

        const { error } = await supabaseAdmin
          .from("companies")
          .update({ subscription_status: "suspended" })
          .eq("id", company_id);

        if (error) throw new Error(`Suspend failed: ${error.message}`);

        return new Response(
          JSON.stringify({ success: true, message: "Company suspended" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      case "reactivate": {
        const { company_id } = params;
        if (!company_id) throw new Error("company_id is required");

        const { error } = await supabaseAdmin
          .from("companies")
          .update({ subscription_status: "active" })
          .eq("id", company_id);

        if (error) throw new Error(`Reactivate failed: ${error.message}`);

        return new Response(
          JSON.stringify({ success: true, message: "Company reactivated" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error("Manage company error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

function generatePassword(length: number): string {
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const nums = "23456789";
  const symbols = "!@#$%&*";
  const charset = lower + upper + nums + symbols;
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  const pw: string[] = [
    lower[bytes[0] % lower.length],
    upper[bytes[1] % upper.length],
    nums[bytes[2] % nums.length],
    symbols[bytes[3] % symbols.length],
  ];

  for (let i = 4; i < length; i++) {
    pw.push(charset[bytes[i] % charset.length]);
  }

  // Shuffle
  for (let i = pw.length - 1; i > 0; i--) {
    const j = bytes[i] % (i + 1);
    [pw[i], pw[j]] = [pw[j], pw[i]];
  }

  return pw.join("");
}
