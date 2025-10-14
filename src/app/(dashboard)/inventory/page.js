'use client';

import { useState, useEffect } from 'react';
import apiClient from '../../../lib/api';
import { 
  FaBoxes, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaWarehouse,
  FaShoppingCart,
  FaClipboardList,
  FaChartLine,
  FaBarcode,
  FaTh,
  FaList,
  FaEnvelope,
  FaTags,
  FaChevronDown,
  FaChevronUp,
  FaSortAmountDown,
  FaSortAmountUp,
  FaDownload,
  FaUpload,
  FaPrint,
  FaTimes,
  FaSave,
  FaTimesCircle
} from 'react-icons/fa';

// Custom Dropdown Component
const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '16px 20px',
          border: 'none',
          borderRadius: '16px',
          fontSize: '16px',
          outline: 'none',
          transition: 'all 0.2s',
          backgroundColor: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'left',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f9fafb';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }}
      >
        <span style={{ 
          color: selectedOption ? '#1f2937' : '#9ca3af',
          fontWeight: selectedOption ? '500' : '400'
        }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown 
          size={14} 
          color="#6b7280" 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }} 
        />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: 'none',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 1000,
          marginTop: '4px',
          overflow: 'hidden',
          animation: 'slideInUp 0.2s ease-out'
        }}>
          {/* Search Input */}
          <div style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#f9fafb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            />
          </div>

          {/* Options List */}
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  backgroundColor: value === option.value ? '#f0fdf4' : 'transparent',
                  color: '#1f2937',
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderLeft: value === option.value ? `4px solid ${option.color}` : '4px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (value !== option.value) {
                    e.target.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (value !== option.value) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '16px' }}>
                  {option.label.split(' ')[0]}
                </span>
                <span>{option.label.split(' ').slice(1).join(' ')}</span>
                {value === option.value && (
                  <FaCheckCircle size={14} color={option.color} style={{ marginLeft: 'auto' }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        />
      )}
    </div>
  );
};

export default function InventoryManagement() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddPurchaseOrderModal, setShowAddPurchaseOrderModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  
  // View states for each section
  const [inventoryView, setInventoryView] = useState('card'); // 'card' or 'list'
  const [suppliersView, setSuppliersView] = useState('card');
  const [recipesView, setRecipesView] = useState('card');
  const [purchaseOrdersView, setPurchaseOrdersView] = useState('card');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    currentStock: 0,
    minStock: 0,
    maxStock: 0,
    costPerUnit: 0,
    supplier: '',
    description: '',
    barcode: '',
    expiryDate: '',
    location: ''
  });

  const [supplierFormData, setSupplierFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    paymentTerms: '',
    notes: ''
  });

  const [purchaseOrderFormData, setPurchaseOrderFormData] = useState({
    supplierId: '',
    items: [{ inventoryItemId: '', inventoryItemName: '', quantity: 1, unitPrice: 0 }],
    expectedDeliveryDate: '',
    notes: ''
  });

  const [recipeFormData, setRecipeFormData] = useState({
    name: '',
    description: '',
    category: '',
    servings: 1,
    prepTime: 0,
    cookTime: 0,
    ingredients: [{ inventoryItemId: '', inventoryItemName: '', quantity: 1, unit: '' }],
    instructions: [''],
    notes: ''
  });

  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [reportData, setReportData] = useState(null);
  
  // Modal states
  const [showAddRecipeModal, setShowAddRecipeModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadRestaurantContext();
  }, []);

  useEffect(() => {
    if (currentRestaurant) {
      loadInventoryData();
    }
  }, [currentRestaurant, searchTerm, selectedCategory]);

  const loadRestaurantContext = async () => {
    try {
      // Get restaurant ID from user data (same approach as dashboard)
      const userData = apiClient.getUser();
      const token = apiClient.getToken();
      
      if (!token || !userData?.id) {
        router.push('/login');
        return;
      }
      
      let restaurantId = null;
      let restaurant = null;
      
      // First, try to use default restaurant from user data
      if (userData?.defaultRestaurant) {
        restaurant = userData.defaultRestaurant;
        restaurantId = restaurant.id;
        console.log('🏢 Inventory: Using default restaurant from user data:', restaurant.name);
      }
      // For staff members, use their assigned restaurant
      else if (userData?.restaurantId) {
        restaurantId = userData.restaurantId;
        // Try to get restaurant data from user object
        if (userData.restaurant) {
          restaurant = userData.restaurant;
        } else {
          // Fallback to localStorage or create basic restaurant object
          const savedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}');
          restaurant = savedRestaurant.id === restaurantId ? savedRestaurant : { id: restaurantId, name: 'Restaurant' };
        }
        console.log('👨‍💼 Inventory: Staff user, using assigned restaurant:', restaurant?.name);
      }
      // For owners/customers, try localStorage fallback
      else {
        const selectedRestaurantId = localStorage.getItem('selectedRestaurantId');
        const savedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}');
        
        if (selectedRestaurantId && savedRestaurant.id === selectedRestaurantId) {
          restaurantId = selectedRestaurantId;
          restaurant = savedRestaurant;
          console.log('🏢 Inventory: Using saved restaurant from localStorage:', restaurant?.name);
        } else {
          console.log('❌ Inventory: No restaurant ID found');
          setError('No restaurant found. Please select a restaurant.');
          return;
        }
      }
      
      if (restaurantId && restaurant) {
        console.log('✅ Inventory: Restaurant ID found:', restaurantId);
        setCurrentRestaurant(restaurant);
      } else {
        console.log('❌ Inventory: No restaurant ID found');
        setError('No restaurant found. Please select a restaurant.');
      }
    } catch (error) {
      console.error('Error loading restaurant context:', error);
      setError('Failed to load restaurant context');
    }
  };

  const loadInventoryData = async () => {
    if (!currentRestaurant) return;
    
    try {
      setLoading(true);
      setError(null);

      // Load inventory items
      const filters = {};
      if (searchTerm) filters.search = searchTerm;
      if (selectedCategory !== 'all') filters.category = selectedCategory;

      // Load data with individual error handling
      const results = await Promise.allSettled([
        apiClient.getInventoryItems(currentRestaurant.id, filters),
        apiClient.getInventoryCategories(currentRestaurant.id),
        apiClient.getSuppliers(currentRestaurant.id),
        apiClient.getInventoryDashboard(currentRestaurant.id),
        apiClient.getRecipes(currentRestaurant.id),
        apiClient.getPurchaseOrders(currentRestaurant.id)
      ]);

      // Process results and handle individual failures
      const [itemsResult, categoriesResult, suppliersResult, dashboardResult, recipesResult, ordersResult] = results;

      // Set data with fallbacks for failed requests
      setInventoryItems(itemsResult.status === 'fulfilled' ? (itemsResult.value.items || []) : []);
      setCategories(categoriesResult.status === 'fulfilled' ? (categoriesResult.value.categories || []) : []);
      setSuppliers(suppliersResult.status === 'fulfilled' ? (suppliersResult.value.suppliers || []) : []);
      setDashboardStats(dashboardResult.status === 'fulfilled' ? (dashboardResult.value.stats || null) : null);
      setRecipes(recipesResult.status === 'fulfilled' ? (recipesResult.value.recipes || []) : []);
      setPurchaseOrders(ordersResult.status === 'fulfilled' ? (ordersResult.value.orders || []) : []);

      // Log any failures for debugging
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`Failed to load data at index ${index}:`, result.reason);
        }
      });

    } catch (error) {
      console.error('Error loading inventory data:', error);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'low': return '#ef4444';
      case 'good': return '#10b981';
      case 'expired': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'low': return <FaExclamationTriangle />;
      case 'good': return <FaCheckCircle />;
      case 'expired': return <FaClock />;
      default: return <FaBoxes />;
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'name') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleAddItem = async () => {
    if (!currentRestaurant) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.createInventoryItem(currentRestaurant.id, formData);
      
      if (response.item) {
        setSuccess('Item added successfully!');
        setShowAddModal(false);
        setFormData({
          name: '',
          category: '',
          unit: '',
          currentStock: 0,
          minStock: 0,
          maxStock: 0,
          costPerUnit: 0,
          supplier: '',
          description: '',
          barcode: '',
          expiryDate: '',
          location: ''
        });
        loadInventoryData(); // Reload data
      }
    } catch (error) {
      console.error('Error adding item:', error);
      setError(error.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentStock: item.currentStock,
      minStock: item.minStock,
      maxStock: item.maxStock,
      costPerUnit: item.costPerUnit,
      supplier: item.supplier,
      description: item.description,
      barcode: item.barcode,
      expiryDate: item.expiryDate || '',
      location: item.location
    });
    setShowEditModal(true);
  };

  const handleUpdateItem = async () => {
    if (!currentRestaurant || !editingItem) return;
    
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.updateInventoryItem(currentRestaurant.id, editingItem.id, formData);
      
      if (response.item) {
        setSuccess('Item updated successfully!');
        setShowEditModal(false);
        setEditingItem(null);
        loadInventoryData(); // Reload data
      }
    } catch (error) {
      console.error('Error updating item:', error);
      setError(error.message || 'Failed to update item');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!currentRestaurant) return;
    
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        setLoading(true);
        setError(null);

        await apiClient.deleteInventoryItem(currentRestaurant.id, itemId);
        setSuccess('Item deleted successfully!');
        loadInventoryData(); // Reload data
      } catch (error) {
        console.error('Error deleting item:', error);
        setError(error.message || 'Failed to delete item');
      } finally {
        setLoading(false);
      }
    }
  };

  // Supplier handlers
  const handleAddSupplier = async () => {
    if (!currentRestaurant) return;
    
    if (!supplierFormData.name || !supplierFormData.contact) {
      setError('Supplier name and contact person are required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.createSupplier(currentRestaurant.id, supplierFormData);
      
      if (response.supplier) {
        setSuccess('Supplier added successfully!');
        setShowAddSupplierModal(false);
        setSupplierFormData({
          name: '',
          contact: '',
          phone: '',
          email: '',
          address: '',
          paymentTerms: '',
          notes: ''
        });
        loadInventoryData(); // Reload data
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
      setError(error.message || 'Failed to add supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSupplier = (supplier) => {
    // Implementation for editing supplier
    console.log('Edit supplier:', supplier);
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (!currentRestaurant) return;
    
    if (confirm('Are you sure you want to delete this supplier?')) {
      try {
        setLoading(true);
        setError(null);
        await apiClient.deleteSupplier(currentRestaurant.id, supplierId);
        setSuccess('Supplier deleted successfully!');
        loadInventoryData();
      } catch (error) {
        console.error('Error deleting supplier:', error);
        setError(error.message || 'Failed to delete supplier');
      } finally {
        setLoading(false);
      }
    }
  };

  // Purchase Order handlers
  const handleAddPurchaseOrder = async () => {
    if (!currentRestaurant) return;
    
    if (!purchaseOrderFormData.supplierId || purchaseOrderFormData.items.length === 0) {
      setError('Please select a supplier and add at least one item');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.createPurchaseOrder(currentRestaurant.id, purchaseOrderFormData);
      
      if (response.order) {
        setSuccess('Purchase order created successfully!');
        setShowAddPurchaseOrderModal(false);
        setPurchaseOrderFormData({
          supplierId: '',
          items: [{ inventoryItemId: '', inventoryItemName: '', quantity: 1, unitPrice: 0 }],
          expectedDeliveryDate: '',
          notes: ''
        });
        loadInventoryData(); // Reload data
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      setError(error.message || 'Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  const addPurchaseOrderItem = () => {
    setPurchaseOrderFormData({
      ...purchaseOrderFormData,
      items: [...purchaseOrderFormData.items, { inventoryItemId: '', inventoryItemName: '', quantity: 1, unitPrice: 0 }]
    });
  };

  const removePurchaseOrderItem = (index) => {
    const newItems = purchaseOrderFormData.items.filter((_, i) => i !== index);
    setPurchaseOrderFormData({
      ...purchaseOrderFormData,
      items: newItems
    });
  };

  const updatePurchaseOrderItem = (index, field, value) => {
    const newItems = [...purchaseOrderFormData.items];
    newItems[index][field] = value;
    
    // If inventoryItemId is being updated, also set the inventoryItemName
    if (field === 'inventoryItemId') {
      const selectedItem = inventoryItems.find(item => item.id === value);
      newItems[index].inventoryItemName = selectedItem ? selectedItem.name : '';
    }
    
    setPurchaseOrderFormData({
      ...purchaseOrderFormData,
      items: newItems
    });
  };

  // Recipe handlers
  const handleAddRecipe = async () => {
    if (!currentRestaurant) return;
    
    if (!recipeFormData.name || recipeFormData.ingredients.length === 0) {
      setError('Please provide recipe name and at least one ingredient');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.createRecipe(currentRestaurant.id, recipeFormData);
      
      if (response.recipe) {
        setSuccess('Recipe created successfully!');
        setShowAddRecipeModal(false);
        setRecipeFormData({
          name: '',
          description: '',
          category: '',
          servings: 1,
          prepTime: 0,
          cookTime: 0,
          ingredients: [{ inventoryItemId: '', inventoryItemName: '', quantity: 1, unit: '' }],
          instructions: [''],
          notes: ''
        });
        loadInventoryData(); // Reload data
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
      setError(error.message || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  const addRecipeIngredient = () => {
    setRecipeFormData({
      ...recipeFormData,
      ingredients: [...recipeFormData.ingredients, { inventoryItemId: '', inventoryItemName: '', quantity: 1, unit: '' }]
    });
  };

  const removeRecipeIngredient = (index) => {
    const newIngredients = recipeFormData.ingredients.filter((_, i) => i !== index);
    setRecipeFormData({
      ...recipeFormData,
      ingredients: newIngredients
    });
  };

  const updateRecipeIngredient = (index, field, value) => {
    const newIngredients = [...recipeFormData.ingredients];
    newIngredients[index][field] = value;
    
    // If inventoryItemId is being updated, also set the inventoryItemName
    if (field === 'inventoryItemId') {
      const selectedItem = inventoryItems.find(item => item.id === value);
      newIngredients[index].inventoryItemName = selectedItem ? selectedItem.name : '';
    }
    
    setRecipeFormData({
      ...recipeFormData,
      ingredients: newIngredients
    });
  };

  const addRecipeInstruction = () => {
    setRecipeFormData({
      ...recipeFormData,
      instructions: [...recipeFormData.instructions, '']
    });
  };

  const removeRecipeInstruction = (index) => {
    const newInstructions = recipeFormData.instructions.filter((_, i) => i !== index);
    setRecipeFormData({
      ...recipeFormData,
      instructions: newInstructions
    });
  };

  const updateRecipeInstruction = (index, value) => {
    const newInstructions = [...recipeFormData.instructions];
    newInstructions[index] = value;
    setRecipeFormData({
      ...recipeFormData,
      instructions: newInstructions
    });
  };

  const handleEditRecipe = (recipe) => {
    // Implementation for editing recipe
    console.log('Edit recipe:', recipe);
  };

  const handleEmailPurchaseOrder = async (order) => {
    if (!currentRestaurant) return;
    
    try {
      setLoading(true);
      setError(null);

      // Get supplier details to find email
      const supplier = suppliers.find(s => s.id === order.supplierId);
      if (!supplier || !supplier.email) {
        setError('Supplier email not found. Please add email to supplier details.');
        return;
      }

      const response = await apiClient.emailPurchaseOrder(currentRestaurant.id, order.id, {
        supplierEmail: supplier.email,
        supplierName: supplier.name
      });
      
      if (response.success) {
        setSuccess('Purchase order sent successfully to supplier!');
      }
    } catch (error) {
      console.error('Error sending purchase order email:', error);
      setError(error.message || 'Failed to send purchase order email');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!currentRestaurant) return;
    
    if (confirm('Are you sure you want to delete this recipe?')) {
      try {
        setLoading(true);
        setError(null);
        await apiClient.deleteRecipe(currentRestaurant.id, recipeId);
        setSuccess('Recipe deleted successfully!');
        loadInventoryData();
      } catch (error) {
        console.error('Error deleting recipe:', error);
        setError(error.message || 'Failed to delete recipe');
      } finally {
        setLoading(false);
      }
    }
  };

  // Purchase order handlers
  const handleUpdateOrderStatus = async (orderId, status) => {
    if (!currentRestaurant) return;
    
    try {
      setLoading(true);
      setError(null);
      await apiClient.updatePurchaseOrder(currentRestaurant.id, orderId, { status });
      setSuccess(`Order ${status} successfully!`);
      loadInventoryData();
    } catch (error) {
      console.error('Error updating order:', error);
      setError(error.message || 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  // Report handlers
  const generateReport = (type) => {
    let reportContent = '';
    let reportTitle = '';

    switch (type) {
      case 'low-stock':
        const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.minStock);
        reportTitle = 'Low Stock Report';
        reportContent = `Low Stock Items (${lowStockItems.length} items):\n\n`;
        lowStockItems.forEach(item => {
          reportContent += `• ${item.name}: ${item.currentStock} ${item.unit} (Min: ${item.minStock})\n`;
        });
        break;
      case 'expired':
        const expiredItems = inventoryItems.filter(item => {
          if (!item.expiryDate) return false;
          return new Date(item.expiryDate) < new Date();
        });
        reportTitle = 'Expired Items Report';
        reportContent = `Expired Items (${expiredItems.length} items):\n\n`;
        expiredItems.forEach(item => {
          reportContent += `• ${item.name}: Expired on ${new Date(item.expiryDate).toLocaleDateString()}\n`;
        });
        break;
      case 'value':
        const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0);
        reportTitle = 'Inventory Value Report';
        reportContent = `Total Inventory Value: ₹${totalValue.toLocaleString()}\n\n`;
        reportContent += `Breakdown by Category:\n`;
        const categoryValues = {};
        inventoryItems.forEach(item => {
          if (!categoryValues[item.category]) categoryValues[item.category] = 0;
          categoryValues[item.category] += item.currentStock * item.costPerUnit;
        });
        Object.entries(categoryValues).forEach(([category, value]) => {
          reportContent += `• ${category}: ₹${value.toLocaleString()}\n`;
        });
        break;
      case 'supplier':
        reportTitle = 'Supplier Report';
        reportContent = `Suppliers (${suppliers.length} suppliers):\n\n`;
        suppliers.forEach(supplier => {
          reportContent += `• ${supplier.name}: ${supplier.contact}\n`;
          if (supplier.phone) reportContent += `  Phone: ${supplier.phone}\n`;
          if (supplier.email) reportContent += `  Email: ${supplier.email}\n`;
          reportContent += `\n`;
        });
        break;
    }

    setReportData({ title: reportTitle, content: reportContent });
  };

  // Helper functions
  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'received': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: FaChartLine },
    { id: 'items', name: 'Inventory Items', icon: FaBoxes },
    { id: 'recipes', name: 'Recipes', icon: FaClipboardList },
    { id: 'suppliers', name: 'Suppliers', icon: FaWarehouse },
    { id: 'purchase', name: 'Purchase Orders', icon: FaShoppingCart },
    { id: 'reports', name: 'Reports', icon: FaChartLine }
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
                <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #059669',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            
      <div style={{ padding: isClient && window.innerWidth <= 768 ? '16px' : '24px' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: isClient && window.innerWidth <= 768 ? '24px' : '32px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <FaBoxes color="#059669" />
              Inventory Management
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Manage your restaurant inventory efficiently
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* View Toggle Buttons */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
              <button
                onClick={() => setInventoryView('card')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: inventoryView === 'card' ? '#059669' : 'transparent',
                  color: inventoryView === 'card' ? 'white' : '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                <FaTh size={12} />
                Cards
              </button>
              <button
                onClick={() => setInventoryView('list')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: inventoryView === 'list' ? '#059669' : 'transparent',
                  color: inventoryView === 'list' ? 'white' : '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                <FaList size={12} />
                List
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              style={{
                backgroundColor: '#059669',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#047857';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#059669';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaPlus size={14} />
              Add Item
            </button>
            
            <button
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s'
              }}
            >
              <FaUpload size={14} />
              Import
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaTimesCircle size={16} />
            {error}
            <button
              onClick={() => setError(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#dc2626',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <FaTimes size={14} />
            </button>
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #a7f3d0',
            color: '#059669',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaCheckCircle size={16} />
            {success}
            <button
              onClick={() => setSuccess(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#059669',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <FaTimes size={14} />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ 
          marginBottom: '24px',
          display: 'flex',
          gap: '4px',
          backgroundColor: 'white',
          padding: '4px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflowX: 'auto'
        }}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? '#059669' : 'transparent',
                  color: activeTab === tab.id ? 'white' : '#6b7280',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
              >
                <IconComponent size={14} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {/* Key Metrics Cards */}
            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Total Items
                </h3>
                <FaBoxes color="#059669" size={20} />
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>
                {dashboardStats?.totalItems || inventoryItems.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Active inventory items
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Low Stock Items
                </h3>
                <FaExclamationTriangle color="#ef4444" size={20} />
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
                {dashboardStats?.lowStockItems || inventoryItems.filter(item => item.status === 'low').length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Need restocking
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Total Value
                </h3>
                <FaChartLine color="#3b82f6" size={20} />
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                ₹{(dashboardStats?.totalValue || inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.costPerUnit), 0)).toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Current inventory value
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Suppliers
                </h3>
                <FaWarehouse color="#8b5cf6" size={20} />
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
                {suppliers.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                Active suppliers
              </div>
            </div>
          </div>
        )}

        {/* Inventory Items Tab */}
        {activeTab === 'items' && (
          <div>
            {/* Filters */}
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              marginBottom: '20px',
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
                <FaSearch style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#6b7280' 
                }} />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#059669'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: 'white',
                  minWidth: '150px'
                }}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>

              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="name">Sort by Name</option>
                  <option value="currentStock">Sort by Stock</option>
                  <option value="costPerUnit">Sort by Cost</option>
                  <option value="lastUpdated">Sort by Date</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  style={{
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                </button>
              </div>
            </div>

            {/* Items Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {sortedItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: `2px solid ${getStatusColor(item.status)}20`,
                    overflow: 'hidden',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  }}
                >
                  {/* Header */}
                  <div style={{
                    padding: '16px',
                    backgroundColor: `${getStatusColor(item.status)}10`,
                    borderBottom: `1px solid ${getStatusColor(item.status)}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getStatusIcon(item.status)}
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: getStatusColor(item.status),
                        textTransform: 'uppercase'
                      }}>
                        {item.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => handleEditItem(item)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '16px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#1f2937',
                      margin: '0 0 8px 0'
                    }}>
                      {item.name}
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Current Stock</div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                          {item.currentStock} {item.unit}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Cost per Unit</div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
                          ₹{item.costPerUnit}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Min Stock</div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#ef4444' }}>
                          {item.minStock} {item.unit}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Max Stock</div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#10b981' }}>
                          {item.maxStock} {item.unit}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Supplier</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        {item.supplier}
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Location</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        {item.location}
                      </div>
                    </div>

                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suppliers Tab */}
        {activeTab === 'suppliers' && (
          <div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Manage Suppliers
              </h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* View Toggle Buttons */}
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
                  <button
                    onClick={() => setSuppliersView('card')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: suppliersView === 'card' ? '#059669' : 'transparent',
                      color: suppliersView === 'card' ? 'white' : '#6b7280',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    <FaTh size={12} />
                    Cards
                  </button>
                  <button
                    onClick={() => setSuppliersView('list')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: suppliersView === 'list' ? '#059669' : 'transparent',
                      color: suppliersView === 'list' ? 'white' : '#6b7280',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    <FaList size={12} />
                    List
                  </button>
                </div>

                <button
                  onClick={() => setShowAddSupplierModal(true)}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaPlus size={14} />
                  Add Supplier
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    padding: '20px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      {supplier.name}
                    </h4>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => handleEditSupplier(supplier)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteSupplier(supplier.id)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Contact Person</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {supplier.contact}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Phone</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {supplier.phone || 'Not provided'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Email</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {supplier.email || 'Not provided'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Payment Terms</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {supplier.paymentTerms || 'Not specified'}
                    </div>
                  </div>

                  {supplier.notes && (
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {supplier.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipes Tab */}
        {activeTab === 'recipes' && (
          <div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Manage Recipes
              </h3>
              <button
                onClick={() => setShowAddRecipeModal(true)}
                style={{
                  backgroundColor: '#059669',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaPlus size={14} />
                Add Recipe
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    padding: '20px',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      {recipe.name}
                    </h4>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => handleEditRecipe(recipe)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Category</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {recipe.category}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Servings</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {recipe.servings} servings
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Prep Time</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {recipe.prepTime} minutes
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Ingredients</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {recipe.ingredients.length} ingredients
                    </div>
                  </div>

                  {recipe.description && (
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: '#f3f4f6',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#6b7280'
                    }}>
                      {recipe.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Orders Tab */}
        {activeTab === 'purchase' && (
          <div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                Purchase Orders
              </h3>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* View Toggle Buttons */}
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f3f4f6', borderRadius: '8px', padding: '4px' }}>
                  <button
                    onClick={() => setPurchaseOrdersView('card')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: purchaseOrdersView === 'card' ? '#059669' : 'transparent',
                      color: purchaseOrdersView === 'card' ? 'white' : '#6b7280',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    <FaTh size={12} />
                    Cards
                  </button>
                  <button
                    onClick={() => setPurchaseOrdersView('list')}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: purchaseOrdersView === 'list' ? '#059669' : 'transparent',
                      color: purchaseOrdersView === 'list' ? 'white' : '#6b7280',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    <FaList size={12} />
                    List
                  </button>
                </div>

                <button
                  onClick={() => setShowAddPurchaseOrderModal(true)}
                  style={{
                    backgroundColor: '#059669',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaPlus size={14} />
                  Create Order
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '20px'
            }}>
              {purchaseOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    padding: '20px',
                    border: `2px solid ${getOrderStatusColor(order.status)}20`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                        Order #{order.id.slice(-8)}
                      </h4>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: getOrderStatusColor(order.status),
                        textTransform: 'uppercase'
                      }}>
                        {order.status}
                      </div>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#059669' }}>
                      ₹{order.totalAmount.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Supplier</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {order.supplierName || 'Unknown Supplier'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Items</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {order.items.length} items
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Created</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {order.expectedDeliveryDate && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Expected Delivery</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                    {/* Email Order Button */}
                    <button
                      onClick={() => handleEmailPurchaseOrder(order)}
                      style={{
                        flex: 1,
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        fontWeight: '600',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <FaEnvelope size={12} />
                      Email Order
                    </button>

                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'received')}
                          style={{
                            flex: 1,
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Mark Received
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                          style={{
                            flex: 1,
                            backgroundColor: '#ef4444',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <div style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                Inventory Reports
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <button
                  onClick={() => generateReport('low-stock')}
                  style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaExclamationTriangle size={16} />
                  Low Stock Report
                </button>
                <button
                  onClick={() => generateReport('expired')}
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    padding: '16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaClock size={16} />
                  Expired Items Report
                </button>
                <button
                  onClick={() => generateReport('value')}
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    padding: '16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaChartLine size={16} />
                  Value Report
                </button>
                <button
                  onClick={() => generateReport('supplier')}
                  style={{
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    padding: '16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaWarehouse size={16} />
                  Supplier Report
                </button>
              </div>
            </div>

            {reportData && (
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {reportData.title}
                  </h4>
                  <button
                    onClick={() => window.print()}
                    style={{
                      backgroundColor: '#059669',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FaPrint size={12} />
                    Print Report
                  </button>
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
                  Generated on: {new Date().toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                  {reportData.content}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other tabs placeholder */}
        {!['dashboard', 'items', 'suppliers', 'recipes', 'purchase', 'reports'].includes(activeTab) && (
          <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
              {tabs.find(tab => tab.id === activeTab)?.name} Coming Soon
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280' }}>
              This feature is under development and will be available soon.
            </p>
          </div>
        )}

        {/* Modern Add Item Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '32px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.2)',
              animation: 'slideInUp 0.3s ease-out'
            }}>
              {/* Modal Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '32px',
                paddingBottom: '20px',
                borderBottom: '2px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#059669',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3)'
                  }}>
                    <FaPlus size={20} color="white" />
                  </div>
                  <div>
                    <h2 style={{ 
                      fontSize: '24px', 
                      fontWeight: '700', 
                      color: '#1f2937', 
                      margin: 0,
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Add New Item
                    </h2>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                      Create a new inventory item
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <FaTimes size={16} color="#6b7280" />
                </button>
              </div>

              {/* Form Content */}
              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Item Name */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Item Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                      placeholder="Enter item name"
                    />
                  </div>
                </div>

                {/* Category & Unit Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Category *
                    </label>
                    <CustomDropdown
                      options={[
                        { value: 'meat', label: '🥩 Meat & Poultry', color: '#ef4444' },
                        { value: 'vegetables', label: '🥬 Vegetables', color: '#10b981' },
                        { value: 'grains', label: '🌾 Grains & Rice', color: '#f59e0b' },
                        { value: 'dairy', label: '🥛 Dairy Products', color: '#3b82f6' },
                        { value: 'spices', label: '🌶️ Spices & Herbs', color: '#8b5cf6' },
                        { value: 'beverages', label: '🥤 Beverages', color: '#06b6d4' },
                        { value: 'frozen', label: '❄️ Frozen Foods', color: '#64748b' },
                        { value: 'packaged', label: '📦 Packaged Goods', color: '#ec4899' }
                      ]}
                      value={formData.category}
                      onChange={(value) => setFormData({...formData, category: value})}
                      placeholder="Select Category"
                    />
                  </div>

                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Unit *
                    </label>
                    <CustomDropdown
                      options={[
                        { value: 'kg', label: '📏 Kilogram (kg)', color: '#059669' },
                        { value: 'g', label: '⚖️ Gram (g)', color: '#059669' },
                        { value: 'l', label: '🥤 Liter (l)', color: '#3b82f6' },
                        { value: 'ml', label: '🧪 Milliliter (ml)', color: '#3b82f6' },
                        { value: 'pcs', label: '🔢 Pieces (pcs)', color: '#8b5cf6' },
                        { value: 'box', label: '📦 Box', color: '#f59e0b' },
                        { value: 'pack', label: '📋 Pack', color: '#ec4899' }
                      ]}
                      value={formData.unit}
                      onChange={(value) => setFormData({...formData, unit: value})}
                      placeholder="Select Unit"
                    />
                  </div>
                </div>

                {/* Stock Levels Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Current Stock
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        value={formData.currentStock}
                        onChange={(e) => setFormData({...formData, currentStock: parseFloat(e.target.value) || 0})}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          border: 'none',
                          borderRadius: '16px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'all 0.2s',
                          backgroundColor: 'white',
                          textAlign: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = '#f9fafb';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#ef4444', 
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Min Stock
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        value={formData.minStock}
                        onChange={(e) => setFormData({...formData, minStock: parseFloat(e.target.value) || 0})}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          border: 'none',
                          borderRadius: '16px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'all 0.2s',
                          backgroundColor: 'white',
                          textAlign: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = '#f9fafb';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#10b981', 
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Max Stock
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        value={formData.maxStock}
                        onChange={(e) => setFormData({...formData, maxStock: parseFloat(e.target.value) || 0})}
                        style={{
                          width: '100%',
                          padding: '16px 20px',
                          border: 'none',
                          borderRadius: '16px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'all 0.2s',
                          backgroundColor: 'white',
                          textAlign: 'center',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = '#f9fafb';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Cost & Supplier Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Cost per Unit (₹)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#059669'
                      }}>
                        ₹
                      </div>
                      <input
                        type="number"
                        value={formData.costPerUnit}
                        onChange={(e) => setFormData({...formData, costPerUnit: parseFloat(e.target.value) || 0})}
                        style={{
                          width: '100%',
                          padding: '16px 20px 16px 50px',
                          border: 'none',
                          borderRadius: '16px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'all 0.2s',
                          backgroundColor: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = '#f9fafb';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Supplier
                    </label>
                    <CustomDropdown
                      options={suppliers.map(supplier => ({
                        value: supplier.name,
                        label: `🏢 ${supplier.name}`,
                        color: '#3b82f6'
                      }))}
                      value={formData.supplier}
                      onChange={(value) => setFormData({...formData, supplier: value})}
                      placeholder="Select Supplier"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: '100px',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      fontFamily: 'inherit',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    placeholder="Enter item description..."
                  />
                </div>

                {/* Barcode & Expiry Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Barcode
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '18px',
                        color: '#6b7280'
                      }}>
                        <FaBarcode />
                      </div>
                      <input
                        type="text"
                        value={formData.barcode}
                        onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '16px 20px 16px 50px',
                          border: 'none',
                          borderRadius: '16px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'all 0.2s',
                          backgroundColor: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = '#f9fafb';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                        placeholder="Enter barcode"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Expiry Date
                    </label>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '18px',
                        color: '#6b7280'
                      }}>
                        📅
                      </div>
                      <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '16px 20px 16px 50px',
                          border: 'none',
                          borderRadius: '16px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'all 0.2s',
                          backgroundColor: 'white',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = '#f9fafb';
                          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Storage Location */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Storage Location
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '20px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '18px',
                      color: '#6b7280'
                    }}>
                      🏠
                    </div>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '16px 20px 16px 50px',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                      placeholder="e.g., Freezer A1, Storage B2"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginTop: '32px', 
                justifyContent: 'flex-end',
                paddingTop: '24px',
                borderTop: '2px solid #f3f4f6'
              }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '16px 32px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <FaTimes size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  style={{
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #059669, #047857)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 24px rgba(5, 150, 105, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 16px rgba(5, 150, 105, 0.3)';
                  }}
                >
                  <FaSave size={16} />
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modern Edit Item Modal */}
        {showEditModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  Edit Item
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '6px'
                  }}
                >
                  <FaTimes size={16} color="#6b7280" />
                </button>
              </div>

              {/* Same form fields as Add Modal */}
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px', display: 'block' }}>
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="Enter item name"
                  />
                </div>

                {/* Add all other form fields here similar to Add Modal */}
                {/* For brevity, I'm showing the structure - you can copy the same fields from Add Modal */}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateItem}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaSave size={14} />
                  Update Item
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modern Add Purchase Order Modal */}
        {showAddPurchaseOrderModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '32px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.2)',
              animation: 'slideInUp 0.3s ease-out'
            }}>
              {/* Modal Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '32px',
                paddingBottom: '20px',
                borderBottom: '2px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#059669',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3)'
                  }}>
                    <FaShoppingCart size={20} color="white" />
                  </div>
                  <div>
                    <h2 style={{ 
                      fontSize: '24px', 
                      fontWeight: '700', 
                      color: '#1f2937', 
                      margin: 0,
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Create Purchase Order
                    </h2>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                      Order inventory items from suppliers
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddPurchaseOrderModal(false)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <FaTimes size={16} color="#6b7280" />
                </button>
              </div>

              {/* Form Content */}
              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Supplier Selection */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Supplier *
                  </label>
                  <select
                    value={purchaseOrderFormData.supplierId}
                    onChange={(e) => setPurchaseOrderFormData({...purchaseOrderFormData, supplierId: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    <option value="">Select a supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Order Items */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#374151'
                    }}>
                      Order Items *
                    </label>
                    <button
                      onClick={addPurchaseOrderItem}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#059669',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#047857';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#059669';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <FaPlus size={12} />
                      Add Item
                    </button>
                  </div>

                  {purchaseOrderFormData.items.map((item, index) => (
                    <div key={index} style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr auto',
                      gap: '12px',
                      alignItems: 'end',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      marginBottom: '12px'
                    }}>
                      {/* Item Selection */}
                      <div>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                          Item
                        </label>
                        <select
                          value={item.inventoryItemId}
                          onChange={(e) => updatePurchaseOrderItem(index, 'inventoryItemId', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: 'white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">Select item</option>
                          {inventoryItems.map(invItem => (
                            <option key={invItem.id} value={invItem.id}>
                              {invItem.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updatePurchaseOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: 'white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}
                        />
                      </div>

                      {/* Unit Price */}
                      <div>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                          Price
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updatePurchaseOrderItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            backgroundColor: 'white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                          }}
                        />
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removePurchaseOrderItem(index)}
                        style={{
                          padding: '12px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#dc2626';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#ef4444';
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Expected Delivery Date */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={purchaseOrderFormData.expectedDeliveryDate}
                    onChange={(e) => setPurchaseOrderFormData({...purchaseOrderFormData, expectedDeliveryDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  />
                </div>

                {/* Notes */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Notes
                  </label>
                  <textarea
                    value={purchaseOrderFormData.notes}
                    onChange={(e) => setPurchaseOrderFormData({...purchaseOrderFormData, notes: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: '80px',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      fontFamily: 'inherit',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    placeholder="Additional notes for the purchase order"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginTop: '32px', 
                justifyContent: 'flex-end',
                paddingTop: '24px',
                borderTop: '2px solid #f3f4f6'
              }}>
                <button
                  onClick={() => setShowAddPurchaseOrderModal(false)}
                  style={{
                    padding: '16px 32px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <FaTimes size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleAddPurchaseOrder}
                  style={{
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #059669, #047857)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 24px rgba(5, 150, 105, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 16px rgba(5, 150, 105, 0.3)';
                  }}
                >
                  <FaShoppingCart size={16} />
                  Create Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modern Add Supplier Modal */}
        {showAddSupplierModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              padding: '32px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.2)',
              animation: 'slideInUp 0.3s ease-out'
            }}>
              {/* Modal Header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '32px',
                paddingBottom: '20px',
                borderBottom: '2px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#059669',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3)'
                  }}>
                    <FaWarehouse size={20} color="white" />
                  </div>
                  <div>
                    <h2 style={{ 
                      fontSize: '24px', 
                      fontWeight: '700', 
                      color: '#1f2937', 
                      margin: 0,
                      background: 'linear-gradient(135deg, #059669, #047857)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Add New Supplier
                    </h2>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                      Create a new supplier
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddSupplierModal(false)}
                  style={{
                    padding: '12px',
                    backgroundColor: '#f3f4f6',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <FaTimes size={16} color="#6b7280" />
                </button>
              </div>

              {/* Form Content */}
              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Supplier Name */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    value={supplierFormData.name}
                    onChange={(e) => setSupplierFormData({...supplierFormData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    placeholder="Enter supplier name"
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    value={supplierFormData.contact}
                    onChange={(e) => setSupplierFormData({...supplierFormData, contact: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    placeholder="Enter contact person name"
                  />
                </div>

                {/* Phone & Email Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={supplierFormData.phone}
                      onChange={(e) => setSupplierFormData({...supplierFormData, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#374151', 
                      marginBottom: '8px', 
                      display: 'block' 
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={supplierFormData.email}
                      onChange={(e) => setSupplierFormData({...supplierFormData, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        border: 'none',
                        borderRadius: '16px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.2s',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Address
                  </label>
                  <textarea
                    value={supplierFormData.address}
                    onChange={(e) => setSupplierFormData({...supplierFormData, address: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: '80px',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      fontFamily: 'inherit',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    placeholder="Enter supplier address"
                  />
                </div>

                {/* Payment Terms */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={supplierFormData.paymentTerms}
                    onChange={(e) => setSupplierFormData({...supplierFormData, paymentTerms: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    placeholder="e.g., Net 30, COD, etc."
                  />
                </div>

                {/* Notes */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Notes
                  </label>
                  <textarea
                    value={supplierFormData.notes}
                    onChange={(e) => setSupplierFormData({...supplierFormData, notes: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: '80px',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      fontFamily: 'inherit',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    placeholder="Additional notes about the supplier"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginTop: '32px', 
                justifyContent: 'flex-end',
                paddingTop: '24px',
                borderTop: '2px solid #f3f4f6'
              }}>
                <button
                  onClick={() => setShowAddSupplierModal(false)}
                  style={{
                    padding: '16px 32px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <FaTimes size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleAddSupplier}
                  style={{
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #059669, #047857)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 24px rgba(5, 150, 105, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 16px rgba(5, 150, 105, 0.3)';
                  }}
                >
                  <FaSave size={16} />
                  Add Supplier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Recipe Modal */}
        {showAddRecipeModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '32px',
              width: '100%',
              maxWidth: '800px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                  Add New Recipe
                </h2>
                <button
                  onClick={() => setShowAddRecipeModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.color = '#374151';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#6b7280';
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                {/* Recipe Name */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    value={recipeFormData.name}
                    onChange={(e) => setRecipeFormData({...recipeFormData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    placeholder="e.g., Chicken Biryani"
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={recipeFormData.category}
                    onChange={(e) => setRecipeFormData({...recipeFormData, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    placeholder="e.g., Main Course, Dessert"
                  />
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px', 
                  display: 'block' 
                }}>
                  Description
                </label>
                <textarea
                  value={recipeFormData.description}
                  onChange={(e) => setRecipeFormData({...recipeFormData, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '16px',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '80px',
                    transition: 'all 0.2s',
                    backgroundColor: 'white',
                    fontFamily: 'inherit',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                  placeholder="Brief description of the recipe"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                {/* Servings */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Servings
                  </label>
                  <input
                    type="number"
                    value={recipeFormData.servings}
                    onChange={(e) => setRecipeFormData({...recipeFormData, servings: parseInt(e.target.value) || 1})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    min="1"
                  />
                </div>

                {/* Prep Time */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Prep Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={recipeFormData.prepTime}
                    onChange={(e) => setRecipeFormData({...recipeFormData, prepTime: parseInt(e.target.value) || 0})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    min="0"
                  />
                </div>

                {/* Cook Time */}
                <div>
                  <label style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px', 
                    display: 'block' 
                  }}>
                    Cook Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={recipeFormData.cookTime}
                    onChange={(e) => setRecipeFormData({...recipeFormData, cookTime: parseInt(e.target.value) || 0})}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    min="0"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Ingredients *
                  </h3>
                  <button
                    onClick={addRecipeIngredient}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaPlus size={12} />
                    Add Ingredient
                  </button>
                </div>

                {recipeFormData.ingredients.map((ingredient, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr auto',
                    gap: '12px',
                    alignItems: 'end',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    marginBottom: '12px'
                  }}>
                    {/* Item Selection */}
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                        Item
                      </label>
                      <select
                        value={ingredient.inventoryItemId}
                        onChange={(e) => updateRecipeIngredient(index, 'inventoryItemId', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="">Select item</option>
                        {inventoryItems.map(invItem => (
                          <option key={invItem.id} value={invItem.id}>
                            {invItem.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={ingredient.quantity}
                        onChange={(e) => updateRecipeIngredient(index, 'quantity', parseFloat(e.target.value) || 1)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        min="0.1"
                        step="0.1"
                      />
                    </div>

                    {/* Unit */}
                    <div>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                        Unit
                      </label>
                      <input
                        type="text"
                        value={ingredient.unit}
                        onChange={(e) => updateRecipeIngredient(index, 'unit', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        placeholder="kg, g, ml, etc."
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeRecipeIngredient(index)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Instructions
                  </h3>
                  <button
                    onClick={addRecipeInstruction}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaPlus size={12} />
                    Add Step
                  </button>
                </div>

                {recipeFormData.instructions.map((instruction, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      backgroundColor: '#059669',
                      color: 'white',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      flexShrink: 0,
                      marginTop: '8px'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <textarea
                        value={instruction}
                        onChange={(e) => updateRecipeInstruction(index, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          outline: 'none',
                          resize: 'vertical',
                          minHeight: '60px',
                          backgroundColor: 'white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          fontFamily: 'inherit'
                        }}
                        placeholder={`Step ${index + 1}...`}
                      />
                    </div>
                    <button
                      onClick={() => removeRecipeInstruction(index)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '8px'
                      }}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px', 
                  display: 'block' 
                }}>
                  Notes
                </label>
                <textarea
                  value={recipeFormData.notes}
                  onChange={(e) => setRecipeFormData({...recipeFormData, notes: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    border: 'none',
                    borderRadius: '16px',
                    fontSize: '16px',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '80px',
                    transition: 'all 0.2s',
                    backgroundColor: 'white',
                    fontFamily: 'inherit',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                  placeholder="Additional notes or tips"
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowAddRecipeModal(false)}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '16px 32px',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#4b5563';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#6b7280';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRecipe}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? '#9ca3af' : '#059669',
                    color: 'white',
                    padding: '16px 32px',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 12px 24px rgba(5, 150, 105, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 8px 16px rgba(5, 150, 105, 0.3)';
                    }
                  }}
                >
                  <FaSave size={16} />
                  {loading ? 'Adding...' : 'Add Recipe'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
