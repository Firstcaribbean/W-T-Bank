"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Badge, Button, Card, CardContent, CardHeader, Input, Label } from "@/components/ui";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(8).optional(),
  confirmPassword: z.string().optional()
}).refine((values) => !values.confirmPassword || values.password === values.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type Values = z.infer<typeof schema>;

const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function AuthForm({ mode, title, subtitle }: { mode: "login" | "register" | "forgot"; title: string; subtitle: string; }) {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      if (!hasSupabaseEnv) {
        if (mode === "forgot") {
          toast.success("Reset flow simulated in demo mode.");
          return;
        }
        if (mode === "register") {
          toast.success("Demo account created.");
          router.push("/login");
          return;
        }
        router.push(values.email.includes("admin") ? "/admin" : "/dashboard");
        return;
      }

      if (mode === "login") {
        if (!values.password) throw new Error("Password is required");
        const { error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password });
        if (error) throw error;
        toast.success("Welcome back");
        router.push("/");
        router.refresh();
        return;
      }

      if (mode === "register") {
        if (!values.password) throw new Error("Password is required");
        const { error } = await supabase.auth.signUp({ email: values.email, password: values.password, options: { data: { full_name: values.fullName ?? "New User" } } });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm.");
        router.push("/login");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(values.email, { redirectTo: `${window.location.origin}/login` });
      if (error) throw error;
      toast.success("Reset link sent to your email.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="grid min-h-screen place-items-center bg-bank-gradient px-4 py-10 text-white">
      <Card className="w-full max-w-md border-white/10 bg-slate-950/60 text-white shadow-soft backdrop-blur-xl">
        <CardHeader>
          <Badge tone="info" className="mb-4 w-fit bg-blue-500/20 text-blue-100">W&T BET Bank</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={onSubmit}>
            {mode === "register" ? <div className="space-y-2"><Label htmlFor="fullName">Full name</Label><Input id="fullName" placeholder="Ada Lovelace" className="bg-white/5 text-white placeholder:text-slate-400" {...register("fullName")} />{errors.fullName ? <p className="text-xs text-red-300">{errors.fullName.message}</p> : null}</div> : null}
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@bank.com" className="bg-white/5 text-white placeholder:text-slate-400" {...register("email")} />{errors.email ? <p className="text-xs text-red-300">{errors.email.message}</p> : null}</div>
            {mode !== "forgot" ? <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" placeholder="Minimum 8 characters" className="bg-white/5 text-white placeholder:text-slate-400" {...register("password")} />{errors.password ? <p className="text-xs text-red-300">{errors.password.message}</p> : null}</div> : null}
            {mode === "register" ? <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm password</Label><Input id="confirmPassword" type="password" className="bg-white/5 text-white placeholder:text-slate-400" {...register("confirmPassword")} />{errors.confirmPassword ? <p className="text-xs text-red-300">{errors.confirmPassword.message}</p> : null}</div> : null}
            <Button className="w-full bg-blue-500 hover:bg-blue-600" disabled={loading} type="submit">{loading ? "Please wait..." : mode === "login" ? "Sign in" : mode === "register" ? "Create account" : "Send reset link"}</Button>
          </form>
          <div className="flex items-center justify-between text-sm text-slate-300">{mode !== "login" ? <Link href="/login" className="hover:text-white">Back to login</Link> : <Link href="/register" className="hover:text-white">Create account</Link>}{mode !== "forgot" ? <Link href="/forgot-password" className="hover:text-white">Forgot password?</Link> : null}</div>
        </CardContent>
      </Card>
    </div>
  );
}

