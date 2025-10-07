import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

const AuthForm = ({ onSuccess }) => {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Email ou senha incorretos!');
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        nome,
        email: user.email,
        tipo,
        criadoEm: new Date().toISOString(),
      });
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado!');
      } else {
        setError(err.message);
      }
    }
  };

  if (currentScreen === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-500 flex flex-col items-center justify-center p-6">
        <div className="text-center text-white">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
              <svg className="w-20 h-20 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2">FutAmador</h1>
            <p className="text-xl opacity-90">Conectando jogadores e times</p>
          </div>
          
          <div className="space-y-4 w-full max-w-sm mx-auto">
            <button 
              onClick={() => setCurrentScreen('login')} 
              className="btn-primary w-full py-4 px-6 text-white font-semibold rounded-xl"
            >
              Entrar
            </button>
            <button 
              onClick={() => setCurrentScreen('register')} 
              className="btn-secondary w-full py-4 px-6 text-white font-semibold rounded-xl"
            >
              Criar Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center p-6">
        <div className="card w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo de volta!</h2>
            <p className="text-gray-600">Entre na sua conta</p>
          </div>
          
          {error && <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">{error}</div>}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <button type="submit" className="btn-primary w-full py-3 text-white font-semibold rounded-lg">
              Entrar
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => setCurrentScreen('register')} 
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Não tem conta? Cadastre-se
            </button>
          </div>
          
          <button 
            onClick={() => setCurrentScreen('splash')} 
            className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
          >
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center p-6">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Criar Conta</h2>
          <p className="text-gray-600">Junte-se à comunidade</p>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
            <input 
              type="text" 
              required 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de usuário</label>
            <select 
              required 
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              <option value="jogador">Jogador</option>
              <option value="time">Time</option>
            </select>
          </div>
          
          <button type="submit" className="btn-primary w-full py-3 text-white font-semibold rounded-lg">
            Criar Conta
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={() => setCurrentScreen('login')} 
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Já tem conta? Entre aqui
          </button>
        </div>
        
        <button 
          onClick={() => setCurrentScreen('splash')} 
          className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
