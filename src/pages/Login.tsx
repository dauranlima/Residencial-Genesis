
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordReset = () => {
    if (newPassword.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres");
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      toast.error("A senha deve conter pelo menos uma letra maiúscula");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    toast.success("Senha alterada com sucesso");
    setIsDialogOpen(false);
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      {/* Background patterned overlay or gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:160px_160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.02)_100%)] pointer-events-none" />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="flex flex-col items-center space-y-8 w-full max-w-md animate-fade-in">
          
          {/* Back to Home Button */}


          {/* Logo Section */}
          <div className="text-center space-y-2">
            <div className="bg-navy-dark p-3 rounded-lg inline-flex items-center justify-center shadow-lg mb-4">
              <Building2 className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-3xl font-bold tracking-wider text-navy-dark">ViziGO - Sistema de Gestão</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Portal de Acesso</p>
          </div>

          {/* Login Card */}
          <div className="w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-luxury p-8 space-y-6 border border-white/20">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-navy-dark">Acesso ao Sistema</h2>
              <p className="text-sm text-muted-foreground">Insira suas credenciais para acessar o seu painel.</p>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    placeholder="Digite seu e-mail" 
                    className="pl-10 h-10 bg-secondary/30 border-secondary-foreground/10 focus:border-gold/50 focus:ring-gold/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-medium">Senha</Label>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <button type="button" className="text-xs font-bold text-gold hover:text-gold-light transition-colors uppercase">
                        Esqueci a senha
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-navy-dark">Redefinir Senha</DialogTitle>
                        <DialogDescription>
                          Insira sua nova senha abaixo.<br />
                          Lembre-se que a senha deve ter no mínimo 8 caracteres e conter pelo menos uma letra maiúscula.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Nova Senha</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Mínimo 8 caracteres, 1 maiúscula"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirme a Senha</Label>
                          <Input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repita a nova senha"
                          />
                        </div>
                        <Button 
                          onClick={handlePasswordReset}
                          className="w-full bg-navy-dark hover:bg-navy text-gold font-semibold uppercase"
                        >
                          Alterar Senha
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="........" 
                    className="pl-10 pr-10 h-10 bg-secondary/30 border-secondary-foreground/10 focus:border-gold/50 focus:ring-gold/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button className="w-full bg-navy-dark hover:bg-navy text-gold font-semibold h-11 uppercase tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl">
                Entrar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/90 px-2 text-muted-foreground">Alternar portal de acesso</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="text-xs font-semibold h-9 border-muted-foreground/20 hover:border-gold/50 hover:bg-gold/5 hover:text-navy text-muted-foreground transition-colors">
                PORTAL DO RESIDENTE
              </Button>
              <Button variant="outline" className="text-xs font-semibold h-9 border-muted-foreground/20 hover:border-gold/50 hover:bg-gold/5 hover:text-navy text-muted-foreground transition-colors">
                ACESSO ADMINISTRATIVO
              </Button>
            </div> 

            <div className="w-full flex justify-center pt-2 border-t border-muted/20">
              <Link to="/" className="w-full">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-navy hover:bg-transparent gap-2 font-normal">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o Início
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center text-muted-foreground/60">
        <div className="container mx-auto px-4">
          <p className="text-xs uppercase tracking-[0.2em] mb-4 font-medium">Excelência em Gestão</p>
          <div className="flex justify-center items-center gap-6 text-[10px] uppercase tracking-wider">
            <span>© 2026 Residencial Morada do Sol 2</span>
            <Link to="/#" className="hover:text-navy transition-colors">Desenvolvido por: Dauran Lima</Link>
            <Link to="/terms" className="hover:text-navy transition-colors">Termos de Serviço</Link>
            <Link to="/support" className="hover:text-navy transition-colors">Suporte</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
