import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Composer from './components/Composer';
import Inspiration from './components/Inspiration';
import Settings from './components/Settings';
import Layout from './components/Layout';
import SetupWizard from './components/SetupWizard';
import Login from './components/Login';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

type View = 'feed' | 'compose' | 'inspiration' | 'settings';

function AppContent() {
  const { initialized, authenticated } = useAuth();
  const [currentView, setCurrentView] = useState<View>('feed');
  const [composerInitialContent, setComposerInitialContent] = useState('');

  if (initialized === null) {
    return (
      <div className="loading-state fade-in">
        <div className="shimmer"></div>
        <p>Connecting to the signal...</p>
      </div>
    );
  }

  if (!initialized) {
    return <SetupWizard />;
  }

  const handleInspire = (content: string) => {
    setComposerInitialContent(content);
    setCurrentView('compose');
  };

  const renderView = () => {
    switch (currentView) {
      case 'feed':
        return <Feed />;
      case 'compose':
        return authenticated ? (
          <Composer 
            initialContent={composerInitialContent}
            onPostCreated={() => {
              setCurrentView('feed');
              setComposerInitialContent('');
            }} 
          />
        ) : (
          <Login onSuccess={() => setCurrentView('compose')} />
        );
      case 'inspiration':
        return <Inspiration onInspire={handleInspire} />;
      case 'settings':
        return authenticated ? (
          <Settings />
        ) : (
          <Login onSuccess={() => setCurrentView('settings')} />
        );
      default:
        return <Feed />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <Layout>
        {renderView()}
      </Layout>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
