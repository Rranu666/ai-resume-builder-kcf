import React from "react";
import { supabase } from "@/api/supabaseClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock } from "lucide-react";

/**
 * Prompt users to sign up / log in at key action points (save, download, etc.)
 * Usage: <AuthPromptModal open={show} onClose={() => setShow(false)} reason="save your resume" />
 */
export default function AuthPromptModal({ open, onClose, reason = "continue" }) {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
  };

  const handleEmailLogin = () => {
    onClose?.();
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.href = `/login?returnUrl=${returnUrl}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl mx-auto mb-3 flex items-center justify-center">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Sign in to {reason}
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm mt-1">
            Create a free account to save your work, download resumes, and access all features — takes less than 30 seconds.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <Button
            onClick={handleGoogleLogin}
            size="lg"
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 gap-3 font-semibold shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-gray-400">or</span>
            </div>
          </div>

          <Button
            onClick={handleEmailLogin}
            size="lg"
            variant="outline"
            className="w-full border-2 border-green-200 text-green-700 hover:bg-green-50 font-semibold"
          >
            Sign up with Email
          </Button>

          <button
            onClick={onClose}
            className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
          >
            Continue without saving
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-green-400" /> Free forever</span>
          <span>·</span>
          <span>No credit card needed</span>
          <span>·</span>
          <span>30 sec setup</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
