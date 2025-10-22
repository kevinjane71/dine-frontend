'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '../lib/api';
import { t } from '../lib/i18n';
import { 
  FaShoppingCart, 
  FaTimes, 
  FaUtensils, 
  FaMinus, 
  FaPlus, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaSave, 
  FaCheckCircle, 
  FaSpinner,
  FaQrcode,
  FaTrash,
  FaPrint
} from 'react-icons/fa';

const OrderSummary = ({ 
  cart, 
  setCart,
  orderType, 
  setOrderType, 
  paymentMethod, 
  setPaymentMethod, 
  onClearCart, 
  onProcessOrder, 
  onSaveOrder, 
  onPlaceOrder,
  onRemoveFromCart, 
  onAddToCart, 
  onUpdateCartItemQuantity,
  onTableNumberChange,
  onCustomerNameChange,
  onCustomerMobileChange,
  processing, 
  placingOrder,
  orderSuccess, 
  setOrderSuccess, 
  error, 
  getTotalAmount,
  tableNumber,
  customerName,
  customerMobile,
  orderLookup,
  setOrderLookup,
  currentOrder,
  setCurrentOrder,
  onShowQRCode,
  restaurantId,
  restaurantName,
  taxSettings
}) => {
  const [invoice, setInvoice] = useState(null);
  const [showInvoicePermanently, setShowInvoicePermanently] = useState(false);
  const [taxBreakdown, setTaxBreakdown] = useState([]);
  const [totalTax, setTotalTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  
  // Debug: Log cart prop received by OrderSummary
  console.log('📋 OrderSummary: Received cart prop:', cart);
  console.log('📋 OrderSummary: Cart length:', cart?.length);
  if (cart?.length > 0) {
    console.log('📋 OrderSummary: First cart item:', cart[0]);
    console.log('📋 OrderSummary: All cart items:', cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })));
  }
  
  const calculateTax = useCallback(async () => {
    console.log('Calculating tax for cart:', cart.length, 'items, restaurantId:', restaurantId);
    if (cart.length === 0 || !restaurantId) {
      setTaxBreakdown([]);
      setTotalTax(0);
      setGrandTotal(getTotalAmount());
      return;
    }

    // Use cached tax settings instead of calling API
    if (!taxSettings?.enabled) {
      console.log('Tax not enabled for this restaurant');
      setTaxBreakdown([]);
      setTotalTax(0);
      setGrandTotal(getTotalAmount());
      return;
    }

    const subtotal = getTotalAmount();
    
    // Calculate tax based on restaurant's tax settings
    const calculatedTaxes = [];
    let totalTaxAmount = 0;

    if (taxSettings.taxes && taxSettings.taxes.length > 0) {
      taxSettings.taxes.forEach(tax => {
        if (tax.enabled) {
          const taxAmount = subtotal * (tax.rate / 100);
          calculatedTaxes.push({
            name: tax.name,
            rate: tax.rate,
            amount: taxAmount
          });
          totalTaxAmount += taxAmount;
        }
      });
    } else if (taxSettings.defaultTaxRate) {
      // Fallback to default tax rate
      const taxAmount = subtotal * (taxSettings.defaultTaxRate / 100);
      calculatedTaxes.push({
        name: 'GST',
        rate: taxSettings.defaultTaxRate,
        amount: taxAmount
      });
      totalTaxAmount = taxAmount;
    }

    console.log('Calculated taxes:', calculatedTaxes, 'Total tax:', totalTaxAmount);
    setTaxBreakdown(calculatedTaxes);
    setTotalTax(totalTaxAmount);
    setGrandTotal(subtotal + totalTaxAmount);

  }, [cart, restaurantId, getTotalAmount, taxSettings]);
  
  // Calculate tax when cart changes
  useEffect(() => {
    console.log('useEffect triggered - cart length:', cart.length, 'restaurantId:', restaurantId, 'taxSettings:', taxSettings);
    if (cart.length > 0 && restaurantId && taxSettings) {
      calculateTax();
    } else {
      setTaxBreakdown([]);
      setTotalTax(0);
      setGrandTotal(getTotalAmount());
    }
  }, [calculateTax, cart, restaurantId, getTotalAmount, taxSettings]);
  
  // Debug logging
  console.log('OrderSummary orderSuccess:', orderSuccess);
  console.log('Tax state - taxBreakdown:', taxBreakdown, 'totalTax:', totalTax, 'grandTotal:', grandTotal);
  
  const generateInvoice = async (orderId) => {
    try {
      console.log('Generating invoice for order ID:', orderId);
      const response = await apiClient.generateInvoice(orderId);
      console.log('Invoice generation response:', response);
      if (response.success) {
        console.log('Invoice generated successfully:', response.invoice);
        setInvoice(response.invoice);
        setShowInvoicePermanently(true);
        console.log('Invoice will remain visible permanently');
        return true;
      } else {
        console.error('Invoice generation failed:', response);
        return false;
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      return false;
    }
  };
  
  const handleProcessOrder = async () => {
    if (typeof onProcessOrder === 'function') {
      try {
        const result = await onProcessOrder();
        console.log('Process order result:', result);
        // If order was successful and we have an order ID, generate invoice
        if (result && result.orderId) {
          console.log('Generating invoice for order:', result.orderId);
          const invoiceGenerated = await generateInvoice(result.orderId);
        }
      } catch (error) {
        console.error('Error in handleProcessOrder:', error);
      }
    }
  };
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'white', 
      borderLeft: '2px solid #e5e7eb', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.08)'
    }}>
      {/* Header - More Compact */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)', 
        padding: '12px', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
        borderRadius: '5px'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '80px',
          height: '80px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(25px, -25px)'
        }} />
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <FaShoppingCart size={12} />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '13px', fontWeight: 'bold', margin: 0 }}>
                {t('dashboard.orderSummary')}
              </h2>
              <p style={{ fontSize: '9px', margin: '1px 0 0 0', opacity: 0.8 }}>
                {cart.reduce((sum, item) => sum + item.quantity, 0)} {t('common.items')}
              </p>
            </div>
          </div>
          
          {/* Edit Mode Indicator */}
          {currentOrder && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: '700',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              ✏️ EDIT MODE
            </div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Order Type Selector - Text Based */}
            <div style={{ display: 'flex', gap: '2px' }}>
              <button
                onClick={() => setOrderType('dine-in')}
                style={{
                  backgroundColor: orderType === 'dine-in' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  padding: '3px 6px',
                  fontSize: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  minWidth: '28px'
                }}
                title="Dine In"
              >
                {t('dashboard.dineIn')}
              </button>
              <button
                onClick={() => setOrderType('takeaway')}
                style={{
                  backgroundColor: orderType === 'takeaway' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  padding: '3px 6px',
                  fontSize: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  minWidth: '28px'
                }}
                title="Takeaway"
              >
                {t('dashboard.takeaway')}
              </button>
            </div>
            
            {/* QR Code Button */}
            <button
              onClick={onShowQRCode}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                padding: '4px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
              }}
              title="Generate QR Code for Customer Orders"
            >
              <FaQrcode size={10} />
            </button>
            
            {/* Clear Button - Icon Only */}
            <button
              onClick={onClearCart}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                padding: '4px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
              }}
              title="Clear Cart"
            >
              <FaTrash size={8} />
            </button>
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '8px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 transparent'
      }}>
        {cart.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <FaUtensils size={16} color="#9ca3af" />
            </div>
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 4px 0' }}>
                No Items Added
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '10px', margin: 0 }}>
                Add items from the menu
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {cart.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '8px', 
                  padding: '8px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      fontWeight: 'bold', 
                      color: '#1f2937', 
                      margin: '0 0 2px 0', 
                      fontSize: '12px', 
                      lineHeight: '1.3',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {item.name}
                      {/* Show indicator for items from original order */}
                      {currentOrder && currentOrder.items && currentOrder.items.some(origItem => origItem.menuItemId === item.id) && (
                        <span style={{
                          fontSize: '8px',
                          fontWeight: 'bold',
                          color: '#f59e0b',
                          backgroundColor: '#fef3c7',
                          padding: '1px 4px',
                          borderRadius: '3px',
                          border: '1px solid #f59e0b'
                        }}>
                          ORIGINAL
                        </span>
                      )}
                      {/* Show indicator for newly added items */}
                      {currentOrder && (!currentOrder.items || !currentOrder.items.some(origItem => origItem.menuItemId === item.id)) && (
                        <span style={{
                          fontSize: '8px',
                          fontWeight: 'bold',
                          color: '#10b981',
                          backgroundColor: '#d1fae5',
                          padding: '1px 4px',
                          borderRadius: '3px',
                          border: '1px solid #10b981'
                        }}>
                          NEW
                        </span>
                      )}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          fontSize: '11px', 
                          fontWeight: '600', 
                          color: '#6b7280' 
                        }}>
                          Subtotal: ₹{item.price * item.quantity}
                        </span>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: 'bold', 
                          color: '#ef4444' 
                        }}>
                          ₹{item.price}
                        </span>
                        <div style={{
                          padding: '1px 4px',
                          borderRadius: '4px',
                          fontSize: '6px',
                          fontWeight: 'bold',
                          backgroundColor: (item.isVeg === true || item.category === 'veg') ? '#dcfce7' : '#fee2e2',
                          color: (item.isVeg === true || item.category === 'veg') ? '#166534' : '#dc2626'
                        }}>
                          {(item.isVeg === true || item.category === 'veg') ? 'V' : 'N'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px'
                  }}>
                    {/* Individual Delete Button */}
                    <button
                      onClick={() => {
                        // Remove all instances of this item
                        const newCart = cart.filter(cartItem => cartItem.id !== item.id);
                        setCart(newCart);
                      }}
                      style={{
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444',
                        backgroundColor: 'transparent',
                        border: '1px solid #fecaca',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#fef2f2';
                        e.target.style.borderColor = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.borderColor = '#fecaca';
                      }}
                      title="Remove item"
                    >
                      <FaTimes size={8} />
                    </button>
                    
                    {/* Quantity Controls */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      backgroundColor: 'white', 
                      borderRadius: '6px', 
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      gap: '2px'
                    }}>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        style={{
                          width: '22px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ef4444',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '4px 0 0 4px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#fef2f2';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <FaMinus size={8} />
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          if (newQuantity > 0 && onUpdateCartItemQuantity) {
                            onUpdateCartItemQuantity(item.id, newQuantity);
                          }
                        }}
                        onBlur={(e) => {
                          // Ensure minimum quantity of 1
                          const quantity = parseInt(e.target.value) || 1;
                          if (quantity < 1) {
                            e.target.value = 1;
                            if (onUpdateCartItemQuantity) {
                              onUpdateCartItemQuantity(item.id, 1);
                            }
                          }
                        }}
                        style={{
                          width: '36px',
                          height: '22px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          color: '#1f2937',
                          border: 'none',
                          fontSize: '11px',
                          backgroundColor: '#f9fafb',
                          outline: 'none',
                          borderRadius: '0'
                        }}
                      />
                      <button
                        onClick={() => onAddToCart(item)}
                        style={{
                          width: '22px',
                          height: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#10b981',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderRadius: '0 4px 4px 0',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f0fdf4';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                        }}
                      >
                        <FaPlus size={8} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Message - Show regardless of cart state */}
      {orderSuccess?.show && (
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#dcfce7', 
          border: '2px solid #22c55e',
          borderRadius: '12px',
          margin: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#22c55e', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              animation: 'bounce 1s infinite'
            }}>
              <FaCheckCircle size={16} style={{ color: 'white' }} />
            </div>
            <div style={{ fontWeight: '800', color: '#166534', fontSize: '16px' }}>
              {orderSuccess.message || 'Order Complete! ✅'}
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#166534', marginBottom: '12px', fontWeight: '600' }}>
            Order #{orderSuccess.orderId} {orderSuccess.message?.includes('placed') ? 'sent to kitchen' : 'billing completed'}
          </div>
          <div style={{ fontSize: '12px', color: '#166534', marginBottom: '16px' }}>
            {orderSuccess.message?.includes('placed') 
              ? 'Your order has been sent to the kitchen for preparation' 
              : 'Payment processed successfully. Thank you for your order!'
            }
          </div>
          
          {/* Show invoice content inline for billing completion */}
          {((orderSuccess?.message?.includes('Billing Complete') && invoice) || showInvoicePermanently) && (
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              border: '2px solid #22c55e', 
              borderRadius: '16px', 
              padding: '20px', 
              marginBottom: '16px',
              marginTop: '16px',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
            }}>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: '700', 
                color: '#166534', 
                marginBottom: '16px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <FaCheckCircle color="#22c55e" size={20} />
                Invoice #{invoice?.id || 'N/A'}
              </div>
              
              {invoice && (
                <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
                  <div style={{ marginBottom: '10px', fontWeight: '600', color: '#1f2937' }}>
                    🏪 Restaurant: {invoice.restaurantName || 'N/A'}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    📋 Order ID: {invoice.orderId || 'N/A'}
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    📅 Date: {invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleString() : 'N/A'}
                  </div>
                  {invoice.customerName && (
                    <div style={{ marginBottom: '10px' }}>
                      👤 Customer: {invoice.customerName}
                    </div>
                  )}
                  {invoice.tableNumber && (
                    <div style={{ marginBottom: '10px' }}>
                      🪑 Table: {invoice.tableNumber}
                    </div>
                  )}
                  
                  <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: '12px', marginTop: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: '600' }}>
                      <span>💰 Subtotal:</span>
                      <span>₹{invoice.subtotal?.toFixed(2) || '0.00'}</span>
                    </div>
                    {invoice.taxBreakdown && invoice.taxBreakdown.map((tax, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#6b7280' }}>
                        <span>📊 {tax.name} ({tax.rate}%):</span>
                        <span>₹{tax.amount?.toFixed(2) || '0.00'}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', borderTop: '2px solid #22c55e', paddingTop: '8px', marginTop: '8px', fontSize: '16px', color: '#166534' }}>
                      <span>💳 Total:</span>
                      <span>₹{((invoice.subtotal || 0) + (invoice.taxBreakdown?.reduce((sum, tax) => sum + (tax.amount || 0), 0) || 0)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    // Create a new window with just the invoice content
                    const printWindow = window.open('', '_blank', 'width=800,height=600');
                    const invoiceContent = `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <title>Invoice #${invoice?.id || 'N/A'}</title>
                          <style>
                            body { font-family: Arial, sans-serif; margin: 20px; }
                            .invoice-header { text-align: center; margin-bottom: 20px; }
                            .invoice-details { margin-bottom: 20px; }
                            .invoice-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                            .invoice-table th, .invoice-table td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                            .invoice-table .total-row { font-weight: bold; border-top: 2px solid #000; }
                            .invoice-footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                          </style>
                        </head>
                        <body>
                          <div class="invoice-header">
                            <h1>Invoice #${invoice?.id || 'N/A'}</h1>
                            <h2>${invoice?.restaurantName || 'Restaurant'}</h2>
                          </div>
                          
                          <div class="invoice-details">
                            <p><strong>Order ID:</strong> ${invoice?.orderId || 'N/A'}</p>
                            <p><strong>Date:</strong> ${invoice?.generatedAt ? new Date(invoice.generatedAt).toLocaleString() : 'N/A'}</p>
                          </div>
                          
                          <table class="invoice-table">
                            <thead>
                              <tr>
                                <th>Description</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Subtotal</td>
                                <td>₹${(invoice?.subtotal || 0).toFixed(2)}</td>
                              </tr>
                              ${invoice?.taxBreakdown?.map(tax => `
                                <tr>
                                  <td>${tax.name} (${tax.rate}%)</td>
                                  <td>₹${(tax.amount || 0).toFixed(2)}</td>
                                </tr>
                              `).join('') || ''}
                              <tr class="total-row">
                                <td>Total</td>
                                <td>₹${((invoice?.subtotal || 0) + (invoice?.taxBreakdown?.reduce((sum, tax) => sum + (tax.amount || 0), 0) || 0)).toFixed(2)}</td>
                              </tr>
                            </tbody>
                          </table>
                          
                          <div class="invoice-footer">
                            <p>Thank you for your business!</p>
                            <p>Generated by DineOpen Restaurant Management System</p>
                          </div>
                        </body>
                      </html>
                    `;
                    printWindow.document.write(invoiceContent);
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => {
                      printWindow.print();
                      printWindow.close();
                    }, 500);
                  }}
                  style={{
                    flex: 1,
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#2563eb';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <FaPrint size={14} />
                  Print Invoice
                </button>
                <button
                  onClick={() => {
                    setShowInvoicePermanently(false);
                    setInvoice(null);
                  }}
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dc2626';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#ef4444';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <FaTimes size={14} />
                  Clear Invoice
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={() => {
              setOrderSuccess(null);
              onClearCart();
            }}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              margin: '0 auto',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
            }}
          >
            <FaPlus size={10} />
            Start New Order
          </button>
        </div>
      )}

      {/* Footer */}
      {cart.length > 0 && (
        <div style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          {/* Total */}
          <div style={{ padding: '12px' }}>
            {/* Tax Breakdown - Compact */}
            {(taxBreakdown.length > 0 || totalTax > 0) && (
              <div style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '8px 12px', 
                borderRadius: '6px', 
                marginBottom: '8px',
                fontSize: '11px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ color: '#6b7280' }}>Subtotal:</span>
                  <span style={{ color: '#374151', fontWeight: '600' }}>₹{getTotalAmount().toFixed(2)}</span>
                </div>
                {taxBreakdown.map((tax, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ color: '#6b7280' }}>{tax.name} ({tax.rate}%):</span>
                    <span style={{ color: '#374151', fontWeight: '600' }}>₹{tax.amount?.toFixed(2) || '0.00'}</span>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)', 
              color: 'white', 
              padding: '12px', 
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{t('common.total')}</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>₹{grandTotal > 0 ? grandTotal.toFixed(2) : getTotalAmount().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          {!orderSuccess?.show && (
            <div style={{ padding: '20px' }}>
              {/* Customer Information */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  color: '#1f2937', 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {t('dashboard.customerName')}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  {/* Customer Name */}
                  <input
                    type="text"
                    placeholder={t('dashboard.customerName')}
                    value={customerName || ''}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#f9fafb',
                      transition: 'border-color 0.2s'
                    }}
                    onChange={(e) => {
                      if (typeof onCustomerNameChange === 'function') {
                        onCustomerNameChange(e.target.value);
                      }
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  
                  {/* Customer Mobile */}
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={customerMobile || ''}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#f9fafb',
                      transition: 'border-color 0.2s'
                    }}
                    onChange={(e) => {
                      if (typeof onCustomerMobileChange === 'function') {
                        onCustomerMobileChange(e.target.value);
                      }
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  
                  {/* Table Number */}
                  <input
                    type="text"
                    placeholder="Table No"
                    value={tableNumber || ''}
                    style={{
                      width: '20%',
                      padding: '8px 10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '12px',
                      outline: 'none',
                      backgroundColor: '#f9fafb',
                      transition: 'border-color 0.2s'
                    }}
                    onChange={(e) => {
                      if (typeof onTableNumberChange === 'function') {
                        onTableNumberChange(e.target.value);
                      }
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  color: '#1f2937', 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <FaCreditCard size={12} />
                  {t('dashboard.paymentMethod')}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[
                    { id: 'cash', label: t('dashboard.cash') },
                    { id: 'upi', label: t('dashboard.upi') },
                    { id: 'card', label: t('dashboard.card') }
                  ].map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        style={{
                          flex: 1,
                          padding: '6px 4px',
                          backgroundColor: isSelected ? '#ef4444' : 'white',
                          color: isSelected ? 'white' : '#6b7280',
                          border: isSelected ? '1px solid #ef4444' : '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '9px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 2px 6px rgba(239, 68, 68, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        {method.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Workflow Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                {/* First Row - Save and Place Order */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={onSaveOrder}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: 'white',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
                    }}
                  >
                        <FaSave size={10} />
                    {t('dashboard.saveOrder')}
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (typeof onPlaceOrder === 'function') {
                        onPlaceOrder();
                      }
                    }}
                    disabled={placingOrder || cart.length === 0}
                    style={{
                      flex: 1,
                      background: placingOrder || cart.length === 0
                        ? 'linear-gradient(135deg, #d1d5db, #9ca3af)' 
                        : 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: placingOrder || cart.length === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      transition: 'all 0.2s',
                      boxShadow: placingOrder || cart.length === 0 ? 'none' : '0 2px 8px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    {placingOrder ? (
                      <>
                        <FaSpinner size={10} style={{ animation: 'spin 1s linear infinite' }} />
                        {t('dashboard.orderProcessing')}
                      </>
                    ) : (
                      <>
                        <FaUtensils size={10} />
                        {t('dashboard.placeOrder')}
                      </>
                    )}
                  </button>
                </div>

                {/* Second Row - Complete Billing Only */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button 
                    onClick={handleProcessOrder}
                    disabled={processing || cart.length === 0}
                    style={{
                      flex: 1,
                      background: processing || cart.length === 0 
                        ? 'linear-gradient(135deg, #d1d5db, #9ca3af)' 
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: processing || cart.length === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      transition: 'all 0.2s',
                      boxShadow: processing || cart.length === 0 ? 'none' : '0 2px 8px rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    {processing ? (
                      <>
                        <FaSpinner size={10} style={{ animation: 'spin 1s linear infinite' }} />
                        {t('dashboard.paymentProcessing')}
                      </>
                    ) : (
                      <>
                        <FaCheckCircle size={10} />
                        {t('dashboard.completeBilling')}
                      </>
                    )}
                  </button>
                </div>
              </div>


              {/* Error Message */}
              {error && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '12px',
                  color: '#dc2626',
                  fontWeight: '600',
                  marginTop: '12px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
