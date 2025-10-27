import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useLocation } from "react-router-dom";



export const PasswordChangeForm = () => {
  const { toast } = useToast();
  const location = useLocation();
  const isPortuguese = location.pathname.startsWith("/pt");
  
  // Direct translations
  const texts = {
    en: {
      title: "Change Password",
      currentPassword: "Current Password",
      currentPasswordPlaceholder: "Enter your current password",
      newPassword: "New Password",
      newPasswordPlaceholder: "Enter your new password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your new password",
      changePassword: "Change Password",
      updating: "Updating...",
      validationError: "Validation Error",
      passwordUpdated: "Password Updated",
      passwordUpdatedDesc: "Your password has been successfully changed.",
      error: "Error",
      errorDesc: "Failed to update password. Please try again.",
      passwordMinLength: "Password must be at least 6 characters",
      passwordMaxLength: "Password must be less than 100 characters",
      passwordsDontMatch: "Passwords don't match"
    },
    pt: {
      title: "Alterar Senha",
      currentPassword: "Senha Atual",
      currentPasswordPlaceholder: "Digite sua senha atual",
      newPassword: "Nova Senha",
      newPasswordPlaceholder: "Digite sua nova senha",
      confirmPassword: "Confirmar Senha",
      confirmPasswordPlaceholder: "Confirme sua nova senha",
      changePassword: "Alterar Senha",
      updating: "Atualizando...",
      validationError: "Erro de Validação",
      passwordUpdated: "Senha Atualizada",
      passwordUpdatedDesc: "Sua senha foi alterada com sucesso.",
      error: "Erro",
      errorDesc: "Falha ao atualizar senha. Tente novamente.",
      passwordMinLength: "A senha deve ter pelo menos 6 caracteres",
      passwordMaxLength: "A senha deve ter menos de 100 caracteres",
      passwordsDontMatch: "As senhas não coincidem"
    }
  };

  const t = (key: string): string => {
    const lang = isPortuguese ? 'pt' : 'en';
    return texts[lang][key as keyof typeof texts.en] || key;
  };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  const passwordSchema = z
    .object({
      newPassword: z
        .string()
        .min(6, t("passwordMinLength"))
        .max(100, t("passwordMaxLength")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordsDontMatch"),
      path: ["confirmPassword"],
    });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate new password
      const validationResult = passwordSchema.safeParse({
        newPassword,
        confirmPassword,
      });

      if (!validationResult.success) {
        const error = validationResult.error.errors[0];
        toast({
          title: t("validationError"),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: t("passwordUpdated"),
        description: t("passwordUpdatedDesc"),
      });

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message || t("errorDesc"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Card className="mystic-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">
              {t("currentPassword")}
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPasswords.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder={t("currentPasswordPlaceholder")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">
              {t("newPassword")}
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPasswords.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder={t("newPasswordPlaceholder")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">
              {t("confirmPassword")}
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPasswords.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder={t("confirmPasswordPlaceholder")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={
              loading || !currentPassword || !newPassword || !confirmPassword
            }
            className="w-full"
          >
            {loading ? t("updating") : t("changePassword")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
