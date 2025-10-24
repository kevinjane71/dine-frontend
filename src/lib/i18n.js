// Internationalization (i18n) configuration
const translations = {
  en: {
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      close: 'Close',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      search: 'Search',
      filter: 'Filter',
      clear: 'Clear',
      submit: 'Submit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      done: 'Done',
      retry: 'Retry',
      refresh: 'Refresh',
      view: 'View',
      details: 'Details',
      settings: 'Settings',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      phone: 'Phone',
      name: 'Name',
      address: 'Address',
      city: 'City',
      state: 'State',
      country: 'Country',
      zipCode: 'ZIP Code',
      date: 'Date',
      time: 'Time',
      amount: 'Amount',
      quantity: 'Quantity',
      total: 'Total',
      subtotal: 'Subtotal',
      tax: 'Tax',
      discount: 'Discount',
      price: 'Price',
      status: 'Status',
      description: 'Description',
      notes: 'Notes',
      category: 'Category',
      available: 'Available',
      unavailable: 'Unavailable',
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      completed: 'Completed',
      cancelled: 'Cancelled',
      processing: 'Processing...',
      veg: 'Veg',
      nonVeg: 'Non-Veg',
      mild: 'Mild',
      medium: 'Medium',
      hot: 'Hot',
      items: 'items'
    },
    
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      menu: 'Menu',
      orders: 'Orders',
      tables: 'Tables',
      customers: 'Customers',
      inventory: 'Inventory',
      analytics: 'Analytics',
      billing: 'Billing',
      admin: 'Admin',
      history: 'Orders',
      kot: 'Kitchen'
    },
    
    // Login Page
    login: {
      title: 'Welcome to DineOpen',
      subtitle: 'Restaurant Management System',
      restaurantOwner: 'Restaurant Owner',
      staffMember: 'Staff Member',
      phoneLogin: 'Phone Login',
      googleLogin: 'Continue with Google',
      enterPhone: 'Enter your phone number',
      phonePlaceholder: '+91 9876543210',
      validPhone: 'Valid phone number',
      sendingOtp: 'Sending OTP...',
      sendOtp: 'Send OTP',
      orContinueWith: 'Or continue with',
      signingIn: 'Signing in...',
      googleDescription: 'Restaurant owners can create accounts using Google',
      enterOtp: 'Enter OTP',
      otpPlaceholder: 'Enter 6-digit OTP',
      verifyOtp: 'Verify OTP',
      resendOtp: 'Resend OTP',
      invalidPhone: 'Please enter a valid phone number',
      invalidOtp: 'Please enter a valid 6-digit OTP',
      loginSuccess: 'Login successful!',
      loginError: 'Login failed. Please try again.',
      otpSent: 'OTP sent successfully!',
      otpError: 'Failed to send OTP. Please try again.',
      verificationError: 'OTP verification failed. Please try again.',
      loginCancelled: 'Login cancelled. Please try again.',
      popupBlocked: 'Popup blocked. Please allow popups and try again.',
      defaultOtp: 'For demo, use OTP: 1234',
      newUser: 'New user? You will be redirected to setup.',
      existingUser: 'Welcome back!'
    },
    
    // Dashboard
    dashboard: {
      title: 'Order Management',
      addItem: 'Add Item',
      searchOrder: 'Search by Table No. or Order ID...',
      quickAdd: 'Quick add: type name or code...',
      orderSummary: 'Order Summary',
      menuCategories: 'Menu Categories',
      yourOrder: 'Your Order',
      clearOrder: 'Clear Order',
      placeOrder: 'Place Order',
      saveOrder: 'Save Order',
      completeBilling: 'Complete Billing',
      tableNumber: 'Table Number',
      customerName: 'Customer Name',
      customerPhone: 'Customer Phone',
      dineIn: 'DINE IN',
      takeaway: 'TAKEAWAY',
      noItems: 'No items in cart',
      totalAmount: 'Total Amount',
      paymentMethod: 'Payment Method',
      cash: 'Cash',
      card: 'Card',
      upi: 'UPI',
      orderPlaced: 'Order placed successfully!',
      orderCompleted: 'Order completed successfully!',
      paymentCompleted: 'Payment completed successfully!',
      selectPaymentMethod: 'Please select a payment method',
      enterTableNumber: 'Please enter table number',
      enterCustomerInfo: 'Please enter customer information',
      emptyCart: 'Cart is empty',
      addItemsFirst: 'Please add items to cart first',
      orderProcessing: 'Processing order...',
      paymentProcessing: 'Processing payment...'
    },
    
    // Menu
    menu: {
      title: 'Menu Management',
      addNewDish: 'Add New Dish',
      bulkUpload: 'Bulk Upload',
      searchMenu: 'Search dishes...',
      allTypes: 'All Types',
      allCategories: 'All Categories',
      gridView: 'Grid View',
      listView: 'List View',
      noDishesFound: 'No dishes found',
      menuReady: 'Menu Management Ready! 🍽️',
      tryDifferentSearch: 'Try different search terms',
      createMenu: 'Create Your Restaurant Menu',
      trySearchingElse: 'Try searching for something else or check out all our delicious categories.',
      setupRestaurantFirst: 'Set up your restaurant first, then start building your amazing menu with delicious dishes, categories, and pricing.',
      editDish: 'Edit Dish',
      dishName: 'Dish Name',
      shortCode: 'Short Code',
      price: 'Price (₹)',
      foodType: 'Food Type',
      spiceLevel: 'Spice Level',
      addDish: 'Add Dish',
      updateDish: 'Update Dish',
      deleteDish: 'Delete Dish',
      confirmDelete: 'Are you sure you want to delete this dish?',
      dishAdded: 'Dish added successfully!',
      dishUpdated: 'Dish updated successfully!',
      dishDeleted: 'Dish deleted successfully!',
      enterDishName: 'Enter dish name',
      enterPrice: 'Enter price',
      describeDish: 'Describe this dish...',
      selectCategory: 'Select category',
      addNewCategory: 'Add new category',
      categoryName: 'Category name',
      categoryDescription: 'Description (optional)',
      categoryAdded: 'Category added successfully!',
      categoryUpdated: 'Category updated successfully!',
      categoryDeleted: 'Category deleted successfully!',
      confirmDeleteCategory: 'Are you sure you want to delete this category?',
      categoryInUse: 'Cannot delete category. Some dishes are using this category.',
      noCategories: 'No categories found',
      uploadMenu: 'Upload Menu',
      freshOrder: 'Fresh Order',
      uploadFromDevice: 'Upload from Device',
      takePhoto: 'Take Photo',
      menuUploaded: 'Menu uploaded successfully!',
      uploadError: 'Upload failed. Please try again.',
      aiProcessing: 'AI is processing your menu...',
      noMenuItems: 'No menu items found',
      searchMenu: 'Search menu items...',
      allCategories: 'All Categories',
      filterByCategory: 'Filter by category',
      gridView: 'Grid View',
      listView: 'List View'
    },
    
    // Admin
    admin: {
      title: 'Admin Panel',
      restaurantSettings: 'Restaurant Settings',
      addRestaurant: 'Add Restaurant',
      adding: 'Adding...',
      addNewStaff: 'Add New Staff Member',
      selectPageAccess: 'Select which pages this staff member can access. Default access includes Dashboard, Orders, Tables, and Menu.',
      startDate: 'Start Date',
      selectRestaurantFirst: 'Select a restaurant first',
      noStaffFound: 'No staff members found',
      restaurantName: 'Restaurant Name',
      restaurantDescription: 'Description',
      restaurantAddress: 'Address',
      restaurantPhone: 'Phone',
      restaurantEmail: 'Email',
      restaurantCuisine: 'Cuisine',
      restaurantTimings: 'Timings',
      openTime: 'Open Time',
      closeTime: 'Close Time',
      lastOrderTime: 'Last Order Time',
      restaurantAdded: 'Restaurant added successfully!',
      restaurantUpdated: 'Restaurant updated successfully!',
      restaurantDeleted: 'Restaurant deleted successfully!',
      confirmDeleteRestaurant: 'Are you sure you want to delete this restaurant?',
      enterRestaurantName: 'Enter restaurant name',
      enterDescription: 'Enter description',
      enterAddress: 'Enter address',
      enterPhone: 'Enter phone number',
      enterEmail: 'Enter email address',
      selectCuisine: 'Select cuisine type',
      noRestaurants: 'No restaurants found',
      restaurantDetails: 'Restaurant Details',
      ownerInfo: 'Owner Information',
      staffManagement: 'Staff Management',
      addStaff: 'Add Staff',
      staffName: 'Staff Name',
      staffRole: 'Role',
      staffPhone: 'Phone Number',
      staffEmail: 'Email',
      waiter: 'Waiter',
      chef: 'Chef',
      manager: 'Manager',
      staffAdded: 'Staff added successfully!',
      staffUpdated: 'Staff updated successfully!',
      staffDeleted: 'Staff deleted successfully!',
      confirmDeleteStaff: 'Are you sure you want to delete this staff member?',
      noStaff: 'No staff members found'
    }
  },
  
  hi: {
    // Common
    common: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      add: 'जोड़ें',
      close: 'बंद करें',
      confirm: 'पुष्टि करें',
      yes: 'हाँ',
      no: 'नहीं',
      search: 'खोजें',
      filter: 'फिल्टर',
      clear: 'साफ करें',
      submit: 'जमा करें',
      back: 'वापस',
      next: 'अगला',
      previous: 'पिछला',
      done: 'हो गया',
      retry: 'पुनः प्रयास',
      refresh: 'रिफ्रेश',
      view: 'देखें',
      details: 'विवरण',
      settings: 'सेटिंग्स',
      profile: 'प्रोफाइल',
      logout: 'लॉगआउट',
      login: 'लॉगिन',
      register: 'रजिस्टर',
      email: 'ईमेल',
      password: 'पासवर्ड',
      phone: 'फोन',
      name: 'नाम',
      address: 'पता',
      city: 'शहर',
      state: 'राज्य',
      country: 'देश',
      zipCode: 'पिन कोड',
      date: 'तारीख',
      time: 'समय',
      amount: 'राशि',
      quantity: 'मात्रा',
      total: 'कुल',
      subtotal: 'उप-योग',
      tax: 'कर',
      discount: 'छूट',
      price: 'कीमत',
      status: 'स्थिति',
      description: 'विवरण',
      notes: 'नोट्स',
      category: 'श्रेणी',
      available: 'उपलब्ध',
      unavailable: 'अनुपलब्ध',
      active: 'सक्रिय',
      inactive: 'निष्क्रिय',
      pending: 'लंबित',
      completed: 'पूर्ण',
      cancelled: 'रद्द',
      processing: 'प्रसंस्करण...',
      veg: 'शाकाहारी',
      nonVeg: 'मांसाहारी',
      mild: 'हल्का',
      medium: 'मध्यम',
      hot: 'तीखा',
      items: 'आइटम'
    },
    
    // Navigation
    nav: {
      dashboard: 'डैशबोर्ड',
      menu: 'मेन्यू',
      orders: 'ऑर्डर',
      tables: 'टेबल',
      customers: 'ग्राहक',
      inventory: 'इन्वेंटरी',
      analytics: 'विश्लेषण',
      billing: 'बिलिंग',
      admin: 'एडमिन',
      history: 'ऑर्डर',
      kot: 'रसोई'
    },
    
    // Login Page
    login: {
      title: 'DineOpen में आपका स्वागत है',
      subtitle: 'रेस्टोरेंट प्रबंधन प्रणाली',
      restaurantOwner: 'रेस्टोरेंट मालिक',
      staffMember: 'स्टाफ सदस्य',
      phoneLogin: 'फोन लॉगिन',
      googleLogin: 'Google के साथ जारी रखें',
      enterPhone: 'अपना फोन नंबर दर्ज करें',
      phonePlaceholder: '+91 9876543210',
      validPhone: 'वैध फोन नंबर',
      sendingOtp: 'OTP भेजा जा रहा है...',
      sendOtp: 'OTP भेजें',
      orContinueWith: 'या इसके साथ जारी रखें',
      signingIn: 'साइन इन हो रहे हैं...',
      googleDescription: 'रेस्टोरेंट मालिक Google का उपयोग करके खाते बना सकते हैं',
      enterOtp: 'OTP दर्ज करें',
      otpPlaceholder: '6 अंकों का OTP दर्ज करें',
      verifyOtp: 'OTP सत्यापित करें',
      resendOtp: 'OTP पुनः भेजें',
      invalidPhone: 'कृपया एक वैध फोन नंबर दर्ज करें',
      invalidOtp: 'कृपया एक वैध 6 अंकों का OTP दर्ज करें',
      loginSuccess: 'लॉगिन सफल!',
      loginError: 'लॉगिन असफल। कृपया पुनः प्रयास करें।',
      otpSent: 'OTP सफलतापूर्वक भेजा गया!',
      otpError: 'OTP भेजने में असफल। कृपया पुनः प्रयास करें।',
      verificationError: 'OTP सत्यापन असफल। कृपया पुनः प्रयास करें।',
      loginCancelled: 'लॉगिन रद्द। कृपया पुनः प्रयास करें।',
      popupBlocked: 'पॉपअप अवरुद्ध। कृपया पॉपअप की अनुमति दें और पुनः प्रयास करें।',
      defaultOtp: 'डेमो के लिए, OTP का उपयोग करें: 1234',
      newUser: 'नया उपयोगकर्ता? आपको सेटअप पर रीडायरेक्ट किया जाएगा।',
      existingUser: 'वापस स्वागत है!'
    },
    
    // Dashboard
    dashboard: {
      title: 'ऑर्डर प्रबंधन',
      addItem: 'आइटम जोड़ें',
      searchOrder: 'टेबल नंबर या ऑर्डर ID से खोजें...',
      quickAdd: 'त्वरित जोड़ें: नाम या कोड टाइप करें...',
      orderSummary: 'ऑर्डर सारांश',
      menuCategories: 'मेन्यू श्रेणियां',
      yourOrder: 'आपका ऑर्डर',
      clearOrder: 'ऑर्डर साफ करें',
      placeOrder: 'ऑर्डर दें',
      saveOrder: 'ऑर्डर सहेजें',
      completeBilling: 'बिलिंग पूर्ण करें',
      tableNumber: 'टेबल नंबर',
      customerName: 'ग्राहक का नाम',
      customerPhone: 'ग्राहक का फोन',
      dineIn: 'डाइन इन',
      takeaway: 'टेकअवे',
      noItems: 'कार्ट में कोई आइटम नहीं',
      totalAmount: 'कुल राशि',
      paymentMethod: 'भुगतान विधि',
      cash: 'नकद',
      card: 'कार्ड',
      upi: 'UPI',
      orderPlaced: 'ऑर्डर सफलतापूर्वक दिया गया!',
      orderCompleted: 'ऑर्डर सफलतापूर्वक पूर्ण हुआ!',
      paymentCompleted: 'भुगतान सफलतापूर्वक पूर्ण हुआ!',
      selectPaymentMethod: 'कृपया भुगतान विधि चुनें',
      enterTableNumber: 'कृपया टेबल नंबर दर्ज करें',
      enterCustomerInfo: 'कृपया ग्राहक की जानकारी दर्ज करें',
      emptyCart: 'कार्ट खाली है',
      addItemsFirst: 'कृपया पहले कार्ट में आइटम जोड़ें',
      orderProcessing: 'ऑर्डर प्रसंस्करण...',
      paymentProcessing: 'भुगतान प्रसंस्करण...'
    },
    
    // Menu
    menu: {
      title: 'मेन्यू प्रबंधन',
      addNewDish: 'नया व्यंजन जोड़ें',
      bulkUpload: 'बल्क अपलोड',
      searchMenu: 'व्यंजन खोजें...',
      allTypes: 'सभी प्रकार',
      allCategories: 'सभी श्रेणियां',
      gridView: 'ग्रिड व्यू',
      listView: 'लिस्ट व्यू',
      noDishesFound: 'कोई व्यंजन नहीं मिला',
      menuReady: 'मेन्यू प्रबंधन तैयार! 🍽️',
      tryDifferentSearch: 'अलग खोज शब्द आज़माएं',
      createMenu: 'अपना रेस्टोरेंट मेन्यू बनाएं',
      trySearchingElse: 'कुछ और खोजने की कोशिश करें या हमारी सभी स्वादिष्ट श्रेणियों को देखें।',
      setupRestaurantFirst: 'पहले अपना रेस्टोरेंट सेटअप करें, फिर स्वादिष्ट व्यंजनों, श्रेणियों और मूल्य निर्धारण के साथ अपना अद्भुत मेन्यू बनाना शुरू करें।',
      editDish: 'व्यंजन संपादित करें',
      dishName: 'व्यंजन का नाम',
      shortCode: 'शॉर्ट कोड',
      price: 'कीमत (₹)',
      foodType: 'भोजन प्रकार',
      spiceLevel: 'मसाले का स्तर',
      addDish: 'व्यंजन जोड़ें',
      updateDish: 'व्यंजन अपडेट करें',
      deleteDish: 'व्यंजन हटाएं',
      confirmDelete: 'क्या आप वाकई इस व्यंजन को हटाना चाहते हैं?',
      dishAdded: 'व्यंजन सफलतापूर्वक जोड़ा गया!',
      dishUpdated: 'व्यंजन सफलतापूर्वक अपडेट हुआ!',
      dishDeleted: 'व्यंजन सफलतापूर्वक हटाया गया!',
      enterDishName: 'व्यंजन का नाम दर्ज करें',
      enterPrice: 'कीमत दर्ज करें',
      describeDish: 'इस व्यंजन का वर्णन करें...',
      selectCategory: 'श्रेणी चुनें',
      addNewCategory: 'नई श्रेणी जोड़ें',
      categoryName: 'श्रेणी का नाम',
      categoryDescription: 'विवरण (वैकल्पिक)',
      categoryAdded: 'श्रेणी सफलतापूर्वक जोड़ी गई!',
      categoryUpdated: 'श्रेणी सफलतापूर्वक अपडेट हुई!',
      categoryDeleted: 'श्रेणी सफलतापूर्वक हटाई गई!',
      confirmDeleteCategory: 'क्या आप वाकई इस श्रेणी को हटाना चाहते हैं?',
      categoryInUse: 'श्रेणी हटा नहीं सकते। कुछ व्यंजन इस श्रेणी का उपयोग कर रहे हैं।',
      noCategories: 'कोई श्रेणी नहीं मिली',
      uploadMenu: 'मेन्यू अपलोड करें',
      freshOrder: 'नया ऑर्डर',
      uploadFromDevice: 'डिवाइस से अपलोड करें',
      takePhoto: 'फोटो लें',
      menuUploaded: 'मेन्यू सफलतापूर्वक अपलोड हुआ!',
      uploadError: 'अपलोड असफल। कृपया पुनः प्रयास करें।',
      aiProcessing: 'AI आपके मेन्यू को प्रसंस्करण कर रहा है...',
      noMenuItems: 'कोई मेन्यू आइटम नहीं मिला',
      searchMenu: 'मेन्यू आइटम खोजें...',
      allCategories: 'सभी श्रेणियां',
      filterByCategory: 'श्रेणी के अनुसार फिल्टर करें',
      gridView: 'ग्रिड व्यू',
      listView: 'लिस्ट व्यू'
    },
    
    // Admin
    admin: {
      title: 'एडमिन पैनल',
      restaurantSettings: 'रेस्टोरेंट सेटिंग्स',
      addRestaurant: 'रेस्टोरेंट जोड़ें',
      adding: 'जोड़ा जा रहा है...',
      addNewStaff: 'नया स्टाफ सदस्य जोड़ें',
      selectPageAccess: 'चुनें कि यह स्टाफ सदस्य किन पेजों तक पहुंच सकता है। डिफ़ॉल्ट पहुंच में डैशबोर्ड, ऑर्डर, टेबल और मेन्यू शामिल हैं।',
      startDate: 'शुरुआती तारीख',
      selectRestaurantFirst: 'पहले एक रेस्टोरेंट चुनें',
      noStaffFound: 'कोई स्टाफ सदस्य नहीं मिला',
      restaurantName: 'रेस्टोरेंट का नाम',
      restaurantDescription: 'विवरण',
      restaurantAddress: 'पता',
      restaurantPhone: 'फोन',
      restaurantEmail: 'ईमेल',
      restaurantCuisine: 'भोजन शैली',
      restaurantTimings: 'समय',
      openTime: 'खुलने का समय',
      closeTime: 'बंद होने का समय',
      lastOrderTime: 'अंतिम ऑर्डर का समय',
      restaurantAdded: 'रेस्टोरेंट सफलतापूर्वक जोड़ा गया!',
      restaurantUpdated: 'रेस्टोरेंट सफलतापूर्वक अपडेट हुआ!',
      restaurantDeleted: 'रेस्टोरेंट सफलतापूर्वक हटाया गया!',
      confirmDeleteRestaurant: 'क्या आप वाकई इस रेस्टोरेंट को हटाना चाहते हैं?',
      enterRestaurantName: 'रेस्टोरेंट का नाम दर्ज करें',
      enterDescription: 'विवरण दर्ज करें',
      enterAddress: 'पता दर्ज करें',
      enterPhone: 'फोन नंबर दर्ज करें',
      enterEmail: 'ईमेल पता दर्ज करें',
      selectCuisine: 'भोजन शैली चुनें',
      noRestaurants: 'कोई रेस्टोरेंट नहीं मिला',
      restaurantDetails: 'रेस्टोरेंट विवरण',
      ownerInfo: 'मालिक की जानकारी',
      staffManagement: 'स्टाफ प्रबंधन',
      addStaff: 'स्टाफ जोड़ें',
      staffName: 'स्टाफ का नाम',
      staffRole: 'भूमिका',
      staffPhone: 'फोन नंबर',
      staffEmail: 'ईमेल',
      waiter: 'वेटर',
      chef: 'शेफ',
      manager: 'मैनेजर',
      staffAdded: 'स्टाफ सफलतापूर्वक जोड़ा गया!',
      staffUpdated: 'स्टाफ सफलतापूर्वक अपडेट हुआ!',
      staffDeleted: 'स्टाफ सफलतापूर्वक हटाया गया!',
      confirmDeleteStaff: 'क्या आप वाकई इस स्टाफ सदस्य को हटाना चाहते हैं?',
      noStaff: 'कोई स्टाफ सदस्य नहीं मिला'
    }
  }
};

// Language detection and storage
const getStoredLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('dineopen_language') || 'en';
  }
  return 'en';
};

const setStoredLanguage = (language) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('dineopen_language', language);
  }
};

// Translation function
export const t = (key, params = {}) => {
  const language = getStoredLanguage();
  const keys = key.split('.');
  let translation = translations[language];
  
  for (const k of keys) {
    if (translation && translation[k]) {
      translation = translation[k];
    } else {
      // Fallback to English if translation not found
      translation = translations.en;
      for (const fallbackKey of keys) {
        if (translation && translation[fallbackKey]) {
          translation = translation[fallbackKey];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }
  
  // Replace parameters in translation
  if (typeof translation === 'string') {
    return translation.replace(/\{\{(\w+)\}\}/g, (match, param) => {
      return params[param] || match;
    });
  }
  
  return translation || key;
};

// Language management
export const getCurrentLanguage = () => getStoredLanguage();

export const setLanguage = (language) => {
  if (translations[language]) {
    setStoredLanguage(language);
    // Dispatch custom event to notify components of language change
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language } 
      }));
    }
    return true;
  }
  return false;
};

export const getAvailableLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' }
];

export default {
  t,
  getCurrentLanguage,
  setLanguage,
  getAvailableLanguages
};




