import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';

const UserProfile = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Estados para todos os campos
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('jogador');
  const [sobre, setSobre] = useState('');
  const [local, setLocal] = useState('');
  const [horario, setHorario] = useState('');
  
  // Estados específicos para JOGADOR
  const [posicao, setPosicao] = useState('');
  const [pePreferido, setPePreferido] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [clubesAnteriores, setClubesAnteriores] = useState('');
  const [disponibilidade, setDisponibilidade] = useState([]);
  
  // Estados específicos para TIME
  const [categoria, setCategoria] = useState('');
  const [fundacao, setFundacao] = useState('');
  const [conquistas, setConquistas] = useState('');
  const [posicoesBuscadas, setPosicoesBuscadas] = useState('');
  const [localTreinos, setLocalTreinos] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          
          // Campos básicos
          setNome(data.nome || '');
          setTipo(data.tipo || 'jogador');
          setSobre(data.sobre || '');
          setLocal(data.local || '');
          setHorario(data.horario || '');
          
          // Campos de jogador
          setPosicao(data.posicao || '');
          setPePreferido(data.pePreferido || '');
          setExperiencia(data.experiencia || 'Iniciante');
          setClubesAnteriores(data.clubesAnteriores || '');
          setDisponibilidade(data.disponibilidade || []);
          
          // Campos de time
          setCategoria(data.categoria || '');
          setFundacao(data.fundacao || '');
          setConquistas(data.conquistas || '');
          setPosicoesBuscadas(data.posicoesBuscadas || '');
          setLocalTreinos(data.localTreinos || '');
          
          // Auto-editar se dados incompletos
          if (!data.nome || !data.tipo || !data.sobre) {
            setIsEditing(true);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user.uid]);

  const handleSave = async () => {
  try {
    // Dados básicos que todos têm
    const dataToSave = {
      uid: user.uid,
      email: user.email,
      nome,
      tipo,
      sobre,
      local,
      horario,
      jogos: userData?.jogos || 0,
      times: userData?.times || 0,
      avaliacao: userData?.avaliacao || 5.0,
      criadoEm: userData?.criadoEm || new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };

    // Adicionar campos específicos baseado no tipo
    if (userData?.tipo === 'jogador' || tipo === 'jogador') {
      if (posicao) dataToSave.posicao = posicao;
      if (pePreferido) dataToSave.pePreferido = pePreferido;
      if (experiencia) dataToSave.experiencia = experiencia;
      if (clubesAnteriores) dataToSave.clubesAnteriores = clubesAnteriores;
      if (disponibilidade.length > 0) dataToSave.disponibilidade = disponibilidade;
    } else {
      if (categoria) dataToSave.categoria = categoria;
      if (fundacao) dataToSave.fundacao = fundacao;
      if (conquistas) dataToSave.conquistas = conquistas;
      if (posicoesBuscadas) dataToSave.posicoesBuscadas = posicoesBuscadas;
      if (localTreinos) dataToSave.localTreinos = localTreinos;
    }
    
    console.log('Dados a salvar:', dataToSave);
    
    // Usar setDoc ao invés de updateDoc (cria se não existir)
    await setDoc(doc(db, 'users', user.uid), dataToSave, { merge: true });
    
    setUserData({ ...userData, ...dataToSave });
    setIsEditing(false);
    alert('Perfil atualizado com sucesso!');
  } catch (error) {
    console.error('Erro detalhado:', error);
    alert(`Erro: ${error.message}`);
  }
};
  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair?')) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
      }
    }
  };

  const toggleDisponibilidade = (dia) => {
    setDisponibilidade(prev => 
      prev.includes(dia) 
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center pb-20">
        <div className="text-white text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  const isJogador = userData?.tipo === 'jogador';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-500 pb-20">
      {/* Header do Perfil */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mr-4 ${
              isJogador ? 'bg-white' : 'bg-gradient-to-br from-yellow-400 to-orange-500'
            }`}>
              {isJogador ? (
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              ) : (
                <span className="text-2xl font-bold text-white">
                  {userData?.nome ? userData.nome[0].toUpperCase() : 'T'}
                </span>
              )}
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">{userData?.nome || 'Usuário'}</h1>
              <div className="flex items-center mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold mr-2 ${
                  isJogador 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'bg-yellow-400 text-yellow-900'
                }`}>
                  {isJogador ? '⚽ Jogador' : '🏆 Time'}
                </span>
                {isJogador && userData?.posicao && (
                  <span className="bg-white bg-opacity-20 text-white px-2 py-1 rounded-full text-xs">
                    {userData.posicao}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="px-6 space-y-4">
        {/* Card Sobre/Bio */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {isJogador ? '👤 Sobre o Jogador' : '🏆 Sobre o Time'}
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {userData?.sobre || 'Sem descrição disponível'}
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 font-medium">📍 Local</p>
              <p className="text-gray-800">{userData?.local || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-gray-500 font-medium">⏰ Horário</p>
              <p className="text-gray-800">{userData?.horario || 'Não informado'}</p>
            </div>
          </div>
        </div>

        {/* Card Específico para JOGADOR */}
        {isJogador && (
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">⚽ Informações Técnicas</h2>
            
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 font-medium">🎯 Posição</p>
                  <p className="text-gray-800 font-semibold">{userData?.posicao || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">🦵 Pé Preferido</p>
                  <p className="text-gray-800">{userData?.pePreferido || 'Não informado'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-gray-500 font-medium">📈 Experiência</p>
                <p className="text-gray-800">{userData?.experiencia || 'Iniciante'}</p>
              </div>
              
              {userData?.clubesAnteriores && (
                <div>
                  <p className="text-gray-500 font-medium">🏟️ Clubes Anteriores</p>
                  <p className="text-gray-800">{userData.clubesAnteriores}</p>
                </div>
              )}
              
              {userData?.disponibilidade && userData.disponibilidade.length > 0 && (
                <div>
                  <p className="text-gray-500 font-medium mb-2">📅 Disponibilidade</p>
                  <div className="flex flex-wrap gap-2">
                    {userData.disponibilidade.map(dia => (
                      <span key={dia} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {dia}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card Específico para TIME */}
        {!isJogador && (
          <div className="bg-white rounded-2xl p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 Informações do Time</h2>
            
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 font-medium">🏷️ Categoria</p>
                  <p className="text-gray-800 font-semibold">{userData?.categoria || 'Não informado'}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">📅 Fundação</p>
                  <p className="text-gray-800">{userData?.fundacao || 'Não informado'}</p>
                </div>
              </div>
              
              {userData?.posicoesBuscadas && (
                <div>
                  <p className="text-gray-500 font-medium">🔍 Posições Buscadas</p>
                  <p className="text-gray-800">{userData.posicoesBuscadas}</p>
                </div>
              )}
              
              {userData?.localTreinos && (
                <div>
                  <p className="text-gray-500 font-medium">🏟️ Local de Treinos</p>
                  <p className="text-gray-800">{userData.localTreinos}</p>
                </div>
              )}
              
              {userData?.conquistas && (
                <div>
                  <p className="text-gray-500 font-medium">🏅 Conquistas</p>
                  <p className="text-gray-800">{userData.conquistas}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Card Estatísticas */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📊 Estatísticas</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{userData?.jogos || 0}</p>
              <p className="text-sm text-gray-500">Jogos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{userData?.times || 0}</p>
              <p className="text-sm text-gray-500">{isJogador ? 'Times' : 'Membros'}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">{userData?.avaliacao || 5.0}</p>
              <p className="text-sm text-gray-500">Avaliação</p>
            </div>
          </div>
        </div>

        {/* Botão Sair */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 border border-red-200 text-red-600 font-semibold py-4 rounded-2xl hover:bg-red-100 transition-colors"
        >
          🚪 Sair da Conta
        </button>
      </div>

      {/* Modal de Edição Especializado */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {isJogador ? '⚽ Editar Perfil de Jogador' : '🏆 Editar Perfil do Time'}
            </h2>
            
            <div className="space-y-4">
              {/* Campos Básicos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder={isJogador ? "Seu nome" : "Nome do time"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sobre</label>
                <textarea
                  value={sobre}
                  onChange={(e) => setSobre(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent h-20"
                  placeholder={isJogador ? "Fale sobre sua experiência no futebol..." : "História e objetivos do time..."}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Local</label>
                  <input
                    type="text"
                    value={local}
                    onChange={(e) => setLocal(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
                  <input
                    type="text"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: 19h"
                  />
                </div>
              </div>

              {/* Campos Específicos para JOGADOR */}
              {isJogador && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">⚽ Informações Técnicas</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Posição</label>
                      <select
                        value={posicao}
                        onChange={(e) => setPosicao(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Selecione...</option>
                        <option value="Goleiro">Goleiro</option>
                        <option value="Zagueiro">Zagueiro</option>
                        <option value="Lateral Direito">Lateral Direito</option>
                        <option value="Lateral Esquerdo">Lateral Esquerdo</option>
                        <option value="Volante">Volante</option>
                        <option value="Meio-campo">Meio-campo</option>
                        <option value="Meia Atacante">Meia Atacante</option>
                        <option value="Ponta Direita">Ponta Direita</option>
                        <option value="Ponta Esquerda">Ponta Esquerda</option>
                        <option value="Centroavante">Centroavante</option>
                        <option value="Qualquer">Qualquer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Pé Preferido</label>
                      <select
                        value={pePreferido}
                        onChange={(e) => setPePreferido(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Selecione...</option>
                        <option value="Direito">Direito</option>
                        <option value="Esquerdo">Esquerdo</option>
                        <option value="Ambos">Ambos</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">Experiência</label>
                    <select
                      value={experiencia}
                      onChange={(e) => setExperiencia(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                      <option value="Semi-profissional">Semi-profissional</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">Clubes Anteriores (opcional)</label>
                    <input
                      type="text"
                      value={clubesAnteriores}
                      onChange={(e) => setClubesAnteriores(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Flamengo, Corinthians..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Disponibilidade</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(dia => (
                        <button
                          key={dia}
                          type="button"
                          onClick={() => toggleDisponibilidade(dia)}
                          className={`px-2 py-1 text-xs rounded-lg transition-colors ${
                            disponibilidade.includes(dia)
                              ? 'bg-green-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {dia.slice(0,3)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Campos Específicos para TIME */}
              {!isJogador && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">🏆 Informações do Time</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Categoria</label>
                      <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Selecione...</option>
                        <option value="Amador">Amador</option>
                        <option value="Semi-profissional">Semi-profissional</option>
                        <option value="Veteranos">Veteranos</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Infantil">Infantil</option>
                        <option value="Juvenil">Juvenil</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Fundação</label>
                      <input
                        type="text"
                        value={fundacao}
                        onChange={(e) => setFundacao(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                        placeholder="Ex: 2020"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">Posições Buscadas</label>
                    <input
                      type="text"
                      value={posicoesBuscadas}
                      onChange={(e) => setPosicoesBuscadas(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Atacante, Meio-campo"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">Local de Treinos</label>
                    <input
                      type="text"
                      value={localTreinos}
                      onChange={(e) => setLocalTreinos(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Centro Esportivo ABC"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Conquistas (opcional)</label>
                    <textarea
                      value={conquistas}
                      onChange={(e) => setConquistas(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 h-16"
                      placeholder="Ex: Campeão Municipal 2023..."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
