import { useState } from 'react';
import { Lock, Mail, Scissors, ArrowLeft } from 'lucide-react';
import { useSalon } from '@/store';

interface AdminLoginProps {
  onBack: () => void;
}

export function AdminLogin({ onBack }: AdminLoginProps) {
  const { adminLogin } = useSalon();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!adminLogin(email, password)) {
      setError('E-mail ou senha incorretos. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-ink flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,169,63,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(192,141,101,0.2) 0%, transparent 50%)' }} />
      </div>

      <div className="relative w-full max-w-md">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-nude-300 hover:text-white transition-colors mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o site
        </button>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-gold flex items-center justify-center">
              <Scissors className="w-8 h-8 text-ink-900" />
            </div>
            <div className="font-serif text-2xl text-ink-900">
              <span className="text-gradient-gold">SEX</span>tons
            </div>
            <div className="text-xs tracking-[0.2em] uppercase text-ink-400 mt-1">Painel Administrativo</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sextons.com.br"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-ink-100 focus:border-gold-400 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-gold text-ink-900 py-3 rounded-xl text-sm font-semibold hover:shadow-gold transition-all active:scale-95"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-ink-100 text-center">
            <p className="text-xs text-ink-400">
              Demonstração: admin@sextons.com.br / sextons2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
