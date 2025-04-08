import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { sendRequest } from '../api';
import { useAuth } from './useAuth';

interface BlockContextType {
  blockedUserIds: string[];
  fetchBlockedUsers: () => void;
  blockUser: (id:string) => void;
  unBlockUser: (id:string) => void;
}

interface Block {
    id: string;
    blockingUserId: string;
    blockedUserId: string;
}
// Create the context with a default value
const BlockContext = createContext<BlockContextType | undefined>(undefined);

// Create a custom hook to use the context
export const useBlockContext = () => {
  const context = useContext(BlockContext);
  if (!context) {
    throw new Error('useBlockContext must be used within a BlockProvider');
  }
  return context;
};

// Create the context provider component
export const BlockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  const { accessToken } = useAuth();

  const fetchBlockedUsers = async () => {
    try {
      const response = await sendRequest({
        endpoint: "api/UserBlock/user/",
        method: "GET",
        accessToken: accessToken as string
      })

      const data:Block[] = await response.data;

      const blockedIds = data.map( b => b.blockedUserId);

      setBlockedUserIds(blockedIds);

      console.log(blockedIds)
    } catch (error) {
      console.error('Failed to fetch blocked users', error);
    }
  };

  const blockUser = ( id:string ) => {
    setBlockedUserIds([...blockedUserIds, id])
  }

  const unBlockUser = ( id:string) => {
    setBlockedUserIds(blockedUserIds.filter( (uid:string) => uid != id))
  }

  // Fetch blocked users once when the app starts
  useEffect(() => {
    fetchBlockedUsers();
  }, [accessToken]);

  return (
    <BlockContext.Provider value={{ blockedUserIds, fetchBlockedUsers, blockUser, unBlockUser  }}>
      {children}
    </BlockContext.Provider>
  );
};
