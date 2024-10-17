"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  lead: string;
}

interface Project {
  id: number;
  name: string;
  clientId: number;
  status: string;
  deadline: string;
  fee: number;
}

interface GlobalState {
  clients: Client[];
  projects: Project[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  currentUser: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(user);
      loadUserData(user);
    }
  }, []);

  const loadUserData = (username: string) => {
    const userData = JSON.parse(localStorage.getItem(`userData_${username}`) || '{}');
    setClients(userData.clients || []);
    setProjects(userData.projects || []);
  };

  const saveUserData = () => {
    if (currentUser) {
      const userData = { clients, projects };
      localStorage.setItem(`userData_${currentUser}`, JSON.stringify(userData));
    }
  };

  useEffect(() => {
    if (currentUser) {
      saveUserData();
    }
  }, [clients, projects]);

  const login = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
    loadUserData(username);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setClients([]);
    setProjects([]);
  };

  return (
    <GlobalStateContext.Provider value={{ 
      clients, 
      projects, 
      setClients, 
      setProjects, 
      currentUser, 
      login, 
      logout 
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};