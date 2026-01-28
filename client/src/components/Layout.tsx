import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout">
      <main className="main-content">
        <div className="content-inner">
          {children}
        </div>
      </main>
      
      <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: var(--sidebar-width);
          padding: 4rem 2rem;
          display: flex;
          justify-content: center;
        }

        .content-inner {
          width: 100%;
          max-width: 900px;
        }

        @media (max-width: 1024px) {
          .main-content {
            margin-left: 0;
            padding-top: 6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
