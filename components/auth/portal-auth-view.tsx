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
    <div className="min-h-screen bg-[#f4f6f2] text-[#15231f] flex flex-col justify-between p-6 md:p-12">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c5efd9] text-[#153e33] flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight text-[#15231f] flex items-center gap-2">
              Advantcore <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#183f35] text-white tracking-widest">ACADEMY</span>
            </div>
            <p className="text-xs text-[#68736e]">Professional Learning & Virtual Workplace Platform · Manchester</p>
          </div>
        </div>

        <Badge variant="outline" className="border-[#dce2dc] text-[#183f35] bg-white hidden sm:inline-flex text-xs font-semibold px-3 py-1">
          Accredited Professional Pathways
        </Badge>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto w-full my-auto py-10 grid md:grid-cols-12 gap-10 items-center">
        {/* Left Column: Platform Mission & Features */}
        <div className="md:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e3f2eb] border border-[#c5efd9] text-[#1b5949] text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Advantcore Career Accelerator Active</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#15231f] leading-tight">
            Learn. Deliver. Prove. Land.
          </h1>

          <p className="text-sm sm:text-base text-[#68736e] leading-relaxed">
            Welcome to Advantcore Academy. Access your professional career pathways, structured learning curriculum, simulated client projects, and stakeholder team.
          </p>

          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3 text-xs text-[#68736e] p-3 rounded-xl bg-white border border-[#dce2dc] shadow-xs">
              <div className="p-2 rounded-lg bg-[#e3f2eb] text-[#1b5949] shrink-0 mt-0.5">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#15231f] text-sm block font-bold mb-0.5">Industry-Accredited Curriculum</strong>
                <span>Comprehensive study modules, lesson mastery checks, and timed mock examinations.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-[#68736e] p-3 rounded-xl bg-white border border-[#dce2dc] shadow-xs">
              <div className="p-2 rounded-lg bg-[#e3f2eb] text-[#1b5949] shrink-0 mt-0.5">
                <BriefcaseBusiness className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#15231f] text-sm block font-bold mb-0.5">Virtual Workplace Experience</strong>
                <span>Deliver structured deliverables and project evidence through supervised review gates.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-[#68736e] p-3 rounded-xl bg-white border border-[#dce2dc] shadow-xs">
              <div className="p-2 rounded-lg bg-[#e3f2eb] text-[#1b5949] shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-[#15231f] text-sm block font-bold mb-0.5">Project Stakeholder & Supervisory Team</strong>
                <span>Collaborate with virtual project sponsors, supervisors, and reviewers in interactive team rooms.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Secure Sign-in Card */}
        <div className="md:col-span-6 md:pl-4">
          <Card className="border-[#dce2dc] bg-white shadow-md rounded-2xl">
            <CardHeader className="space-y-1.5 p-7 pb-4">
              <CardTitle className="text-xl font-bold text-[#15231f] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#183f35]" />
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-[#68736e] text-xs leading-relaxed">
                Enter your authorized Advantcore Academy credentials to access your portal.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-7 pt-2">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 text-xs rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#15231f]" htmlFor="email-input">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8ba49b]" />
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#dce2dc] bg-[#f7f8f6] text-[#15231f] placeholder-[#8ba49b] text-sm focus:outline-none focus:ring-2 focus:ring-[#183f35] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#15231f]" htmlFor="password-input">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8ba49b]" />
                    <input
                      id="password-input"
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[#dce2dc] bg-[#f7f8f6] text-[#15231f] placeholder-[#8ba49b] text-sm focus:outline-none focus:ring-2 focus:ring-[#183f35] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full primary-action mt-3 h-11 font-bold cursor-pointer rounded-lg text-sm"
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
      <footer className="max-w-6xl mx-auto w-full pt-6 border-t border-[#dce2dc] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#68736e]">
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
