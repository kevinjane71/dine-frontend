export const setupKeyboardShortcuts = (callbacks) => {
  const handleKeyDown = (event) => {
    const { key, ctrlKey, altKey, shiftKey } = event;
    
    // Prevent shortcuts when typing in input fields
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      // Allow Ctrl+A for select all in inputs
      if (ctrlKey && key === 'a') return;
      // Allow Escape to clear focus
      if (key === 'Escape') {
        event.target.blur();
        return;
      }
      // Don't trigger other shortcuts while typing
      return;
    }

    // Search shortcuts
    if (key === '/' || (ctrlKey && key === 'f')) {
      event.preventDefault();
      callbacks.focusSearch?.();
      return;
    }

    // Number keys for categories (1-6)
    if (key >= '1' && key <= '6' && !ctrlKey && !altKey) {
      event.preventDefault();
      const categoryIndex = parseInt(key) - 1;
      callbacks.selectCategory?.(categoryIndex);
      return;
    }

    // Cart shortcuts
    if (ctrlKey) {
      switch (key) {
        case 'Enter':
        case 'Return':
          event.preventDefault();
          callbacks.processOrder?.();
          break;
        case 'h':
          event.preventDefault();
          callbacks.holdOrder?.();
          break;
        case 's':
          event.preventDefault();
          callbacks.saveOrder?.();
          break;
        case 'p':
          event.preventDefault();
          callbacks.printKOT?.();
          break;
        case 'Delete':
        case 'Backspace':
          event.preventDefault();
          callbacks.clearCart?.();
          break;
      }
    }

    // Order type shortcuts
    if (altKey) {
      switch (key) {
        case 'd':
          event.preventDefault();
          callbacks.setOrderType?.('dine-in');
          break;
        case 'e':
          event.preventDefault();
          callbacks.setOrderType?.('delivery');
          break;
        case 'p':
          event.preventDefault();
          callbacks.setOrderType?.('pickup');
          break;
      }
    }

    // Navigation shortcuts
    if (key === 'Escape') {
      event.preventDefault();
      callbacks.clearSelection?.();
    }

    // Quick add shortcuts (Shift + number for quick quantities)
    if (shiftKey && key >= '1' && key <= '9') {
      event.preventDefault();
      const quantity = parseInt(key);
      callbacks.setQuickQuantity?.(quantity);
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};

export const KEYBOARD_SHORTCUTS = {
  search: 'Press / to search',
  categories: 'Press 1-6 to select categories',
  orderTypes: 'Alt+D (Dine), Alt+E (Delivery), Alt+P (Pickup)',
  cart: {
    process: 'Ctrl+Enter to process order',
    save: 'Ctrl+S to save',
    print: 'Ctrl+P to print KOT',
    hold: 'Ctrl+H to hold order',
    clear: 'Ctrl+Backspace to clear cart'
  },
  quickQuantity: 'Shift+1-9 for quick quantity selection',
  escape: 'Esc to clear/cancel'
};