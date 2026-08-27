"use client"

import React, { useState } from "react"
import {
  Sparkles, ArrowRight, Loader2, Lock, Mail, CheckCircle2,
  ShieldAlert, Award, BriefcaseBusiness, Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/auth-context"

export function PortalAuthView() {
  const { signIn } = useAuth()
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
      setError(res.error || "Authentication failed. Please verify your credentials.")
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
            <p className="text-xs text-slate-400">Professional Learning & Virtual Workplace Platform · Manchester</p>
          </div>
        </div>

        <Badge variant="outline" className="border-slate-700 text-slate-300 bg-slate-900/60 hidden sm:inline-flex text-xs">
          Accredited Professional Pathways
        </Badge>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full my-auto py-10 grid md:grid-cols-12 gap-10 items-center">
        {/* Left Column: Platform Mission & Features */}
        <div className="md:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Advantcore Career Accelerator Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Learn. Deliver. Prove. Land.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Welcome to Advantcore Academy. Access your professional career pathways, structured learning curriculum, simulated client projects, and AI stakeholder team.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block">Industry-Accredited Curriculum</strong>
                <span>Comprehensive study modules, lesson mastery checks, and timed mock examinations.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
                <BriefcaseBusiness className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block">Virtual Workplace Experience</strong>
                <span>Deliver structured deliverables and project evidence through supervised review gates.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white block">Grounded AI Stakeholder Team</strong>
                <span>Collaborate with virtual project sponsors, supervisors, and reviewers in interactive team rooms.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Secure Sign-in Card */}
        <div className="md:col-span-6 md:pl-6">
          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-md shadow-2xl">
            <CardHeader className="space-y-1.5 pb-4">
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs">
                Enter your authorized Advantcore Academy credentials to access your portal.
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
                      placeholder="Enter your email"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-700 bg-slate-950/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300" htmlFor="password-input">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      id="password-input"
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-700 bg-slate-950/60 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full primary-action mt-3 h-10 font-semibold cursor-pointer"
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
          <span>UK GDPR Compliant</span>
          <span>·</span>
          <span>Professional Standards</span>
          <span>·</span>
          <span>Manchester Digital Studio</span>
        </div>
      </footer>
    </div>
  )
}
