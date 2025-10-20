import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const SearchUsers = ({ user }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = [];
        querySnapshot.forEach((doc) => {
          usersList.push({ uid: doc.id, ...doc.data() });
        });
        setAllUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user?.uid]);

  useEffect(() => {
    let filtered = allUsers;
    if (filterType !== 'todos') {
      filtered = filtered.filter(u => u.tipo === filterType);
    }
    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.local?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  }, [allUsers, searchTerm, filterType]);

  async function sendFriendRequest(fromId, toId) {
    try {
      // Criar pedido pendente na subcoleção friends do usuário destino
      await setDoc(
        doc(db, "users", toId, "friends", fromId),
        { status: "pending", since: null }
      );
      // Opcional: criar pedido no usuário remetente para controle futuro
      await setDoc(
        doc(db, "users", fromId, "friends", toId),
        { status: "pending", since: null }
      );
      alert(`Pedido de amizade enviado para ${toId}!`);
    } catch (error) {
      console.error("Erro ao enviar pedido de amizade:", error);
      alert(`Erro ao enviar pedido: ${error.message}`);
    }
  }

  const handleConnect = (targetUser) => {
    if (targetUser.uid === user.uid) {
      alert('Você não pode se conectar com você mesmo!');
      return;
    }
    sendFriendRequest(user.uid, targetUser.uid);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Encontre Jogadores e Times</h1>
          {/* Barra de Busca */}
          <div className="relative mb-4">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nome ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          {/* Filtros */}
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterType('todos')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                filterType === 'todos' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('jogador')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                filterType === 'jogador' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Jogadores
            </button>
            <button
              onClick={() => setFilterType('time')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                filterType === 'time' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Times
            </button>
          </div>
        </div>
      </div>
      {/* Lista de Usuários */}
      <div className="px-6 py-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Nenhum resultado encontrado</h3>
            <p className="text-gray-600">Seja o primeiro a se cadastrar como {filterType === 'todos' ? 'jogador ou time' : filterType}!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((targetUser, index) => (
              <div key={targetUser.uid || index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-white">
                        {targetUser.nome ? targetUser.nome[0].toUpperCase() : '?'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <h3 className="text-lg font-bold text-gray-800 mr-2">
                          {targetUser.nome || 'Usuário'}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          targetUser.tipo === 'time' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {targetUser.tipo === 'time' ? 'Time' : 'Jogador'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {targetUser.sobre || 'Sem descrição disponível'}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                          {targetUser.local || 'Local não informado'}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                          </svg>
                          {targetUser.horario || 'Horário flexível'}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect(targetUser)}
                    className="ml-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
                  >
                    Conectar
                  </button>
                </div>
                {/* Estatísticas */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-lg font-bold text-green-600">{targetUser.jogos || 0}</p>
                      <p className="text-xs text-gray-500">Jogos</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-blue-600">{targetUser.times || 0}</p>
                      <p className="text-xs text-gray-500">Times</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-orange-500">
                        {targetUser.avaliacao ? parseFloat(targetUser.avaliacao).toFixed(1) : '5.0'}
                      </p>
                      <p className="text-xs text-gray-500">Avaliação</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-purple-600">{targetUser.nivel || 'Iniciante'}</p>
                      <p className="text-xs text-gray-500">Nível</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;
