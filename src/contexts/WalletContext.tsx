import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'earning' | 'reward';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  deposit: (amount: number) => Promise<boolean>;
  withdraw: (amount: number, bankAccount: string) => Promise<boolean>;
  addEarning: (amount: number, description: string) => void;
  addReward: (amount: number, description: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(245000); // Initial balance in Rial
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earning',
      amount: 50000,
      description: 'درآمد از ویدیو "آموزش React"',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'reward',
      amount: 25000,
      description: 'پاداش ورود روزانه',
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: '3',
      type: 'deposit',
      amount: 100000,
      description: 'واریز از کارت بانکی',
      date: '2024-01-13',
      status: 'completed'
    },
    {
      id: '4',
      type: 'withdraw',
      amount: 75000,
      description: 'برداشت به حساب بانکی',
      date: '2024-01-12',
      status: 'completed'
    }
  ]);

  const deposit = async (amount: number): Promise<boolean> => {
    try {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount,
        description: 'واریز از کارت بانکی',
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      setTransactions(prev => [newTransaction, ...prev]);
      
      // Simulate payment processing
      setTimeout(() => {
        setBalance(prev => prev + amount);
        setTransactions(prev => 
          prev.map(t => 
            t.id === newTransaction.id 
              ? { ...t, status: 'completed' as const }
              : t
          )
        );
      }, 2000);

      return true;
    } catch (error) {
      return false;
    }
  };

  const withdraw = async (amount: number, bankAccount: string): Promise<boolean> => {
    if (amount > balance) {
      return false;
    }

    try {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'withdraw',
        amount,
        description: `برداشت به حساب ${bankAccount}`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => prev - amount);
      
      // Simulate withdrawal processing
      setTimeout(() => {
        setTransactions(prev => 
          prev.map(t => 
            t.id === newTransaction.id 
              ? { ...t, status: 'completed' as const }
              : t
          )
        );
      }, 3000);

      return true;
    } catch (error) {
      return false;
    }
  };

  const addEarning = (amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'earning',
      amount,
      description,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev + amount);
  };

  const addReward = (amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'reward',
      amount,
      description,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev + amount);
  };

  const value = {
    balance,
    transactions,
    deposit,
    withdraw,
    addEarning,
    addReward
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};