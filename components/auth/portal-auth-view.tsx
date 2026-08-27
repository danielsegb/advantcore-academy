"use client"

import React, { useState } from "react"
import {
  Sparkles, ShieldCheck, UserCheck, KeyRound, ArrowRight, Loader2,
  Lock, Mail, CheckCircle2, ShieldAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/auth-context"

export function PortalAuthView() {
  const { signIn, switchDemoRole } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await signIn(email, password)
    setLoading(false)

    if (!res.success) {
      setError(res.error || "Authentication failed. Please verify credentials.")
    }
  }

  function handleQuickRole(role: "admin" | "learner" | "new_learner") {
    if (role === "admin") {
      switchDemoRole("admin")
    } else if (role === "learner") {
      switchDemoRole("learner")
    } else {
      signIn("amanda@advantcore.co", "temp123")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100 flex flex-col justify-between p-6 md:p-12">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight text-white flex items-center gap-2">
              Advantcore <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary-foreground border border-primary/30">ACADEMY</span>
            </div>
            <p className="text-xs text-slate-400">Professional Certification & Simulated Workplace Platform · Manchester</p>
          </div>
        </div>

        <Badge variant="outline" className="border-slate-700 text-slate-400 bg-slate-900/60 hidden sm:inline-flex">
          BCS Accredited Syllabus
        </Badge>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full my-auto py-8 grid md:grid-cols-12 gap-8 items-center">
        {/* Left Column: Value Prop & Context */}
        <div className="md:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Advantcore BA Career Accelerator Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Learn. Deliver. Prove. Land.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Welcome to Advantcore Academy. Access your 12-week Business Analysis pathway, official BCS study materials, 5-stage simulated client projects, and AI stakeholder team.
          </p>

          {/* Quick Access Roles Cards */}
          <div className="pt-2 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Quick Role Sign-In Options
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => handleQuickRole("admin")}
                className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-950/40 hover:bg-indigo-900/50 hover:border-indigo-400 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="font-semibold text-sm text-white">Platform Administrator</div>
                <div className="text-xs text-slate-400 mt-0.5">Daniel Emmanuel · Admin Studio & User Onboarding</div>
              </button>

              {/* Learner Button */}
              <button
                type="button"
                onClick={() => handleQuickRole("learner")}
                className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 hover:border-emerald-400 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="font-semibold text-sm text-white">Enrolled Learner</div>
                <div className="text-xs text-slate-400 mt-0.5">Amanda Okafor · BA Pathway & Workplace</div>
              </button>
            </div>

            {/* First Login Demo */}
            <button
              type="button"
              onClick={() => handleQuickRole("new_learner")}
              className="w-full px-4 py-2.5 rounded-lg border border-amber-500/20 bg-amber-950/20 hover:bg-amber-950/40 text-xs text-amber-300 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                <span>Test New Learner Onboarding (Mandatory Password Rotation)</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Secure Sign-in Card */}
        <div className="md:col-span-6 md:pl-6">
          <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Enter your authorized Advantcore Academy credentials to continue.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 text-xs rounded-lg bg-destructive/20 border border-destructive/30 text-rose-300 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300" htmlFor="email-input">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@advantcore.co or learner@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-700 bg-slate-950/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-300" htmlFor="password-input">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400">Default password: Advantcore2026!</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="password-input"
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-700 bg-slate-950/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full primary-action mt-2 h-10 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying credentials...
                    </>
                  ) : (
                    <>
                      Sign in <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>© 2026 Advantcore Ltd. Registered in England & Wales. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span>UK GDPR Certified</span>
          <span>·</span>
          <span>BCS Foundation Aligned</span>
          <span>·</span>
          <span>Manchester Digital Studio</span>
        </div>
      </footer>
    </div>
  )
}
