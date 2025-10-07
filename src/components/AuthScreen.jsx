import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

const AuthScreen = () => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Email ou senha incorretos!');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        nome,
        email: userCredential.user.email,
        tipo,
        nivel: 'Iniciante',
        jogos: 0,
        times: 0,
        avaliacao: 5.0,
        horario: 'todos os dias',
        local: 'campo do zé',
        sobre: '',
        criadoEm: new Date().toISOString(),
      });
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'Este email já está cadastrado!' : 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  // Tela Splash
  if (currentScreen === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-500 flex flex-col items-center justify-center p-6">
        <div className="text-center text-white mb-16">
          <div className="w-32 h-32 mx-auto mb-8 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <svg className="w-16 h-16 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="6"/>
              <path d="M12 14c-6.67 0-10 2.69-10 6v2h20v-2c0-3.31-3.33-6-10-6z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-4">Tindãodofut   </h1>
          <p className="text-xl opacity-90 mb-16">Conectando jogadores e times</p>
        </div>
        
        <div className="w-full max-w-sm space-y-4">
          <button 
            onClick={() => setCurrentScreen('login')} 
            className="w-full py-4 px-6 bg-white text-green-600 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Entrar
          </button>
          <button 
            onClick={() => setCurrentScreen('register')} 
            className="w-full py-4 px-6 bg-black bg-opacity-20 text-white font-semibold text-lg rounded-2xl border-2 border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-200"
          >
            Criar Conta
          </button>
        </div>
      </div>
    );
  }

  // Tela de Login
  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo de volta!</h2>
            <p className="text-gray-600">Entre na sua conta</p>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div className="mt-6 text-center space-y-4">
            <button 
              onClick={() => setCurrentScreen('register')} 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Não tem conta? Cadastre-se
            </button>
            <button 
              onClick={() => setCurrentScreen('splash')} 
              className="block w-full text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de Cadastro
return (
  <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center p-6">
    <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Criar Conta</h2>
        <p className="text-gray-600">Junte-se à comunidade</p>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
          <input 
            type="text" 
            required 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="Seu nome ou nome do time"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="seu@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            placeholder="••••••••"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Você é:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTipo('jogador')}
              className={`p-4 border-2 rounded-xl transition-all ${
                tipo === 'jogador' 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <p className="font-medium">Jogador</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTipo('time')}
              className={`p-4 border-2 rounded-xl transition-all ${
                tipo === 'time' 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <p className="font-medium">Time</p>
              </div>
            </button>
          </div>
        </div>
        
        {tipo && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {tipo === 'jogador' ? 'Informações do Jogador' : 'Informações do Time'}
            </h3>
            
            {tipo === 'jogador' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Posição preferida</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                    <option>Goleiro</option>
                    <option>Zagueiro</option>
                    <option>Lateral</option>
                    <option>Meio-campo</option>
                    <option>Atacante</option>
                    <option>Qualquer posição</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Experiência</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                    <option>Iniciante</option>
                    <option>Intermediário</option>
                    <option>Avançado</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Categoria</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500">
                    <option>Amador</option>
                    <option>Semi-profissional</option>
                    <option>Veteranos</option>
                    <option>Feminino</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Buscamos jogadores para</label>
                  <input 
                    type="text" 
                    placeholder="Ex: atacante, meio-campo..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading || !tipo}
          className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>
      
      <div className="mt-6 text-center space-y-4">
        <button 
          onClick={() => setCurrentScreen('login')} 
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Já tem conta? Entre aqui
        </button>
        <button 
          onClick={() => setCurrentScreen('splash')} 
          className="block w-full text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Voltar
        </button>
      </div>
    </div>
  </div>
);
};

export default AuthScreen;
