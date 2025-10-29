import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Stars, Sparkles, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguageNavigation } from "@/hooks/useLanguageNavigation";

const createEmailSchema = (t: (key: string) => string) => z.object({
  email: z.string()
    .email({ message: t('auth.emailInvalid') })
    .max(255, { message: t('auth.emailTooLong') })
});

const createPasswordSchema = (t: (key: string) => string) => z.object({
  email: z.string()
    .email({ message: t('auth.emailInvalid') })
    .max(255, { message: t('auth.emailTooLong') }),
  password: z.string()
    .min(6, { message: t('auth.passwordTooShort') })
    .max(100, { message: t('auth.passwordTooLong') })
});

const createNewPasswordSchema = (t: (key: string) => string) => z.object({
  password: z.string()
    .min(6, { message: t('auth.passwordTooShort') })
    .max(100, { message: t('auth.passwordTooLong') }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: t('auth.passwordsDontMatch'),
  path: ["confirmPassword"],
});



const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { navigate, routes } = useLanguageNavigation();
  const { t } = useTranslation();

  useEffect(() => {
    // Check URL parameters for password recovery
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const type = urlParams.get('type');

    if (accessToken && type === 'recovery') {
      setIsPasswordRecovery(true);
      return;
    }

    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && !isPasswordRecovery) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate, isPasswordRecovery]);

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      const passwordSchema = createPasswordSchema(t);
      const validationResult = passwordSchema.safeParse({
        email: email.trim(),
        password
      });

      if (!validationResult.success) {
        const error = validationResult.error.errors[0];
        toast({
          title: t('auth.validationError'),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      cleanupAuthState();
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: t('auth.signInSuccess'),
          description: t('auth.signInSuccessDescription'),
        });
        window.location.href = routes.dashboard;
      }
    } catch (error: any) {
      toast({
        title: t('auth.signInError'),
        description: error.message || t('auth.signInErrorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate email
      const emailSchema = createEmailSchema(t);
      const validationResult = emailSchema.safeParse({
        email: resetEmail.trim()
      });

      if (!validationResult.success) {
        const error = validationResult.error.errors[0];
        toast({
          title: t('auth.validationError'),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim(),
        {
          redirectTo: `${window.location.origin}/auth`,
        }
      );

      if (error) throw error;

      toast({
        title: t('auth.passwordResetSent'),
        description: t('auth.passwordResetSentDescription'),
      });

      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate new password
      const newPasswordSchema = createNewPasswordSchema(t);
      const validationResult = newPasswordSchema.safeParse({
        password: newPassword,
        confirmPassword
      });

      if (!validationResult.success) {
        const error = validationResult.error.errors[0];
        toast({
          title: t('auth.validationError'),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: t('auth.passwordUpdated'),
        description: t('auth.passwordUpdatedDescription'),
      });

      // Clear the URL parameters and redirect to home
      window.history.replaceState({}, document.title, routes.auth);
      setIsPasswordRecovery(false);
      navigate('/');

    } catch (error: any) {
      toast({
        title: t('auth.error'),
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />


      <Card className="w-full max-w-md relative bg-card/80 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/assets/eternia-new-logo.png"
              alt="Eternia Logo"
              className="h-20 w-20 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {t('auth.welcomeTitle')}
          </CardTitle>
          <CardDescription>
            {t('auth.welcomeDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isPasswordRecovery ? (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-center">{t('auth.setNewPassword')}</h3>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  {t('auth.setNewPasswordDescription')}
                </p>
              </div>

              <form onSubmit={handleNewPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('auth.newPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder={t('auth.enterNewPassword')}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('auth.confirmPassword')}</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder={t('auth.confirmNewPassword')}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.updating') : t('auth.updatePassword')}
                </Button>
              </form>
            </>
          ) : !showForgotPassword ? (
            <>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">{t('auth.email')}</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('auth.enterEmail')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">{t('auth.password')}</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder={t('auth.enterPassword')}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.loading') : t('auth.signIn')}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="text-lg font-medium">{t('auth.resetPassword')}</h3>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      placeholder={t('auth.enterEmail')}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t('auth.resetPasswordHelp')}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.sending') : t('auth.sendResetLink')}
                </Button>
              </form>
            </>
          )}

          <div className="mt-6 p-4 bg-card/50 rounded-lg border border-white/10">
            <p className="text-sm text-muted-foreground text-center">
              {t('auth.noAccess')} <br />
              <span className="text-primary">{t('auth.purchaseMessage')}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;