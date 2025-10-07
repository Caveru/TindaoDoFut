import React, { useState } from 'react';
import UserProfile from './UserProfile';
import SearchUsers from './SearchUsers';

const MainApp = ({ user }) => {
  const [currentView, setCurrentView] = useState('search');

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <UserProfile user={user} />;
      case 'search':
        return <SearchUsers user={user} />;
      case 'messages':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Mensagens</h2>
              <p className="text-gray-600">Em breve!</p>
            </div>
          </div>
        );
      case 'agenda':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Agenda</h2>
              <p className="text-gray-600">Em breve!</p>
            </div>
          </div>
        );
      default:
        return <SearchUsers user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderContent()}
      
      {/* Menu de Navegação Inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 shadow-lg">
        <div className="flex justify-around">
          <button 
            onClick={() => setCurrentView('profile')} 
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
              currentView === 'profile' 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-xs font-medium">Perfil</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('search')} 
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
              currentView === 'search' 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <span className="text-xs font-medium">Buscar</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('messages')} 
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
              currentView === 'messages' 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
            </svg>
            <span className="text-xs font-medium">Mensagens</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('agenda')} 
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
              currentView === 'agenda' 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
            </svg>
            <span className="text-xs font-medium">Agenda</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
