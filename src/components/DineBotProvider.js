import React, { createContext, useContext, useState } from 'react';
import DineBot from './DineBot';

const DineBotContext = createContext();

export const useDineBot = () => {
  const context = useContext(DineBotContext);
  if (!context) {
    throw new Error('useDineBot must be used within a DineBotProvider');
  }
  return context;
};

export const DineBotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);

  const openDineBot = (currentRestaurantId) => {
    setRestaurantId(currentRestaurantId);
    setIsOpen(true);
  };

  const closeDineBot = () => {
    setIsOpen(false);
    setRestaurantId(null);
  };

  const value = {
    isOpen,
    restaurantId,
    openDineBot,
    closeDineBot
  };

  return (
    <DineBotContext.Provider value={value}>
      {children}
      <DineBot 
        restaurantId={restaurantId}
        isOpen={isOpen}
        onClose={closeDineBot}
      />
    </DineBotContext.Provider>
  );
};














