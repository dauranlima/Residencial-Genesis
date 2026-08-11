import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, KeyRound, Building2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Por favor, informe o e-mail e a senha.');
      return;
    }

    setLoading(true);

    try {
      // 1. Tentar autenticação via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.warn('Supabase Auth error:', error.message);
        
        // Se a conta não existe ainda no Supabase Auth, mas é o e-mail/senha do Root Admin solicitados
        if (email.trim().toLowerCase() === 'dauranlima@gmail.com' && password === '123123@') {
          // Tentar cadastrar automaticamente no Supabase Auth
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
              data: { role: 'super_admin', name: 'Root Admin' }
            }
          });

          if (!signUpError && signUpData.user) {
            toast.success('Conta Root Admin criada e autenticada no Supabase!');
            localStorage.setItem('vizi_super_admin_session', JSON.stringify({
              email: email.trim(),
              role: 'super_admin',
              authenticatedAt: new Date().toISOString()
            }));
            navigate('/super-admin');
            return;
          }
        }

        // Se falhar o Auth mas for a credencial Root correta, concede sessão Root local
        if (email.trim().toLowerCase() === 'dauranlima@gmail.com' && password === '123123@') {
          toast.success('Autenticado como Root Admin!');
          localStorage.setItem('vizi_super_admin_session', JSON.stringify({
            email: email.trim(),
            role: 'super_admin',
            authenticatedAt: new Date().toISOString()
          }));
          navigate('/super-admin');
          return;
        }

        throw new Error(error.message || 'Credenciais inválidas.');
      }

      if (data?.session || data?.user) {
        // Verificar se é o usuário Root Admin ou tem permissão de super admin
        const isRootEmail = data.user.email?.toLowerCase() === 'dauranlima@gmail.com';
        
        toast.success(`Bem-vindo, Super Admin (${data.user.email})!`);
        localStorage.setItem('vizi_super_admin_session', JSON.stringify({
          email: data.user.email,
          role: isRootEmail ? 'root_admin' : 'super_admin',
          authenticatedAt: new Date().toISOString()
        }));
        navigate('/super-admin');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao realizar login no Supabase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-2xl border border-amber-500/30 shadow-lg shadow-amber-500/5 mb-2">
            <ShieldCheck className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
            Portal Super Admin
          </h1>
          <p className="text-sm text-slate-400">
            Painel Root de Gestão & Configurações de Sistema
          </p>
        </div>


        {/* Login Card */}
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-slate-100 font-bold flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              Autenticação Supabase
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Entre com sua conta autorizada para acessar as configurações de infraestrutura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-300">
                  E-mail Root Admin
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="dauranlima@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-slate-950/60 border-slate-800 focus:border-amber-500/50 text-slate-100 placeholder:text-slate-600 h-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-300">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 bg-slate-950/60 border-slate-800 focus:border-amber-500/50 text-slate-100 placeholder:text-slate-600 h-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold h-10 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Entrar no Super Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => navigate('/vizigo')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-1 mx-auto"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Voltar ao Sistema de Condomínio</span>
          </button>
        </div>
      </div>
    </div>
  );
}
