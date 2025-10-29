/**
 * Smart Placeholder Image Utility
 * 
 * This utility matches menu item names to appropriate placeholder images
 * when the restaurant owner hasn't uploaded a custom image.
 * 
 * Priority:
 * 1. User uploaded image (if exists)
 * 2. Smart keyword matching
 * 3. Category-based fallback
 * 4. Generic food image
 */

/**
 * Get the appropriate placeholder image for a menu item
 * @param {string} itemName - Name of the menu item
 * @param {string} category - Category of the menu item
 * @param {string|null} userImage - User uploaded image URL
 * @returns {string} - Image URL or path
 */
export const getMenuItemImage = (itemName, category, userImage = null) => {
  // Priority 1: Use user uploaded image if available
  if (userImage) {
    return userImage;
  }

  // Priority 2: Smart keyword matching
  const name = (itemName || '').toLowerCase();
  
  // CHINESE DISHES
  if (name.includes('noodle')) {
    return '/placeholder-images/noodles.jpg';
  }
  if (name.includes('fried rice') || name.includes('rice')) {
    return '/placeholder-images/fried-rice.jpg';
  }
  if (name.includes('manchurian')) {
    return '/placeholder-images/manchurian.jpg';
  }
  if (name.includes('spring roll')) {
    return '/placeholder-images/spring-rolls.jpg';
  }
  if (name.includes('chilli paneer') || name.includes('paneer chilli')) {
    return '/placeholder-images/chilli-paneer.jpg';
  }
  if (name.includes('chinese platter')) {
    return '/placeholder-images/chinese-platter.jpg';
  }

  // PANEER DISHES
  if (name.includes('paneer tikka')) {
    return '/placeholder-images/paneer-tikka.jpg';
  }
  if (name.includes('paneer') && !name.includes('chilli')) {
    return '/placeholder-images/paneer-curry.jpg';
  }

  // KEBABS
  if (name.includes('kebab') || name.includes('kabab')) {
    return '/placeholder-images/kebab.jpg';
  }

  // SOYA CHAAP
  if (name.includes('chaap') || name.includes('champ')) {
    return '/placeholder-images/soya-chaap.jpg';
  }

  // CORN
  if (name.includes('corn')) {
    return '/placeholder-images/crispy-corn.jpg';
  }

  // POTATO DISHES
  if (name.includes('potato') || name.includes('aloo')) {
    return '/placeholder-images/potato-dish.jpg';
  }

  // TANDOORI
  if (name.includes('tandoori platter') || name.includes('tandoori sizzler')) {
    return '/placeholder-images/tandoori-platter.jpg';
  }

  // SALT & PEPPER
  if (name.includes('salt') && name.includes('pepper')) {
    return '/placeholder-images/salt-pepper.jpg';
  }

  // THALI
  if (name.includes('thali')) {
    return '/placeholder-images/thali.jpg';
  }

  // DAL
  if (name.includes('dal') || name.includes('daal')) {
    return '/placeholder-images/dal.jpg';
  }
  if (name.includes('chole') || name.includes('mattar') || name.includes('matar')) {
    return '/placeholder-images/dal.jpg';
  }

  // BREAD
  if (name.includes('kulcha') || name.includes('bhatura') || name.includes('pao') || 
      name.includes('naan') || name.includes('roti') || name.includes('paratha')) {
    return '/placeholder-images/indian-bread.jpg';
  }

  // BHAJI
  if (name.includes('bhaji')) {
    return '/placeholder-images/bhaji.jpg';
  }

  // PAPAD
  if (name.includes('papad')) {
    return '/placeholder-images/appetizer.jpg';
  }

  // CURD
  if (name.includes('curd') || name.includes('dahi') || name.includes('raita')) {
    return '/placeholder-images/appetizer.jpg';
  }

  // Priority 3: Category-based fallback
  const cat = (category || '').toLowerCase();
  
  if (cat === 'chinese') {
    return '/placeholder-images/chinese-platter.jpg';
  }
  if (cat === 'appetizer' || cat === 'starter' || cat === 'starters') {
    return '/placeholder-images/appetizer.jpg';
  }
  if (cat === 'main-course' || cat === 'main course' || cat === 'maincourse') {
    return '/placeholder-images/paneer-curry.jpg';
  }
  if (cat === 'bread' || cat === 'breads') {
    return '/placeholder-images/indian-bread.jpg';
  }
  if (cat === 'dal' || cat === 'dals') {
    return '/placeholder-images/dal.jpg';
  }
  if (cat === 'dessert' || cat === 'desserts' || cat === 'sweet' || cat === 'sweets') {
    return '/placeholder-images/generic-food.jpg'; // You can add dessert.jpg later
  }
  if (cat === 'beverage' || cat === 'beverages' || cat === 'drink' || cat === 'drinks') {
    return '/placeholder-images/generic-food.jpg'; // You can add beverage.jpg later
  }

  // Priority 4: Generic fallback
  return '/placeholder-images/generic-food.jpg';
};

/**
 * Get placeholder type for database storage (optional)
 * This can be stored in DB for faster lookups
 */
export const getPlaceholderType = (itemName, category) => {
  const name = (itemName || '').toLowerCase();
  
  if (name.includes('noodle')) return 'noodles';
  if (name.includes('fried rice') || name.includes('rice')) return 'fried-rice';
  if (name.includes('manchurian')) return 'manchurian';
  if (name.includes('spring roll')) return 'spring-rolls';
  if (name.includes('chilli paneer')) return 'chilli-paneer';
  if (name.includes('paneer tikka')) return 'paneer-tikka';
  if (name.includes('paneer')) return 'paneer-curry';
  if (name.includes('kebab')) return 'kebab';
  if (name.includes('chaap')) return 'soya-chaap';
  if (name.includes('corn')) return 'crispy-corn';
  if (name.includes('potato') || name.includes('aloo')) return 'potato-dish';
  if (name.includes('tandoori platter')) return 'tandoori-platter';
  if (name.includes('thali')) return 'thali';
  if (name.includes('dal') || name.includes('chole') || name.includes('mattar')) return 'dal';
  if (name.includes('kulcha') || name.includes('bhatura') || name.includes('pao')) return 'indian-bread';
  if (name.includes('bhaji')) return 'bhaji';

  const cat = (category || '').toLowerCase();
  if (cat === 'chinese') return 'chinese-platter';
  if (cat === 'appetizer') return 'appetizer';
  if (cat === 'bread') return 'indian-bread';
  if (cat === 'dal') return 'dal';

  return 'generic-food';
};

/**
 * Check if an item has a user-uploaded image
 */
export const hasUserImage = (item) => {
  return !!(
    item.image || 
    item.imageUrl || 
    (item.images && Array.isArray(item.images) && item.images.length > 0)
  );
};

/**
 * Get the final display image for a menu item
 * Handles multiple image field formats
 */
export const getDisplayImage = (item) => {
  // Check for user uploaded images
  if (item.image && item.image !== '') {
    return item.image;
  }
  
  if (item.imageUrl && item.imageUrl !== '') {
    return item.imageUrl;
  }
  
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    return item.images[0].url || item.images[0];
  }

  // Use smart placeholder
  return getMenuItemImage(item.name, item.category, null);
};

export default {
  getMenuItemImage,
  getPlaceholderType,
  hasUserImage,
  getDisplayImage
};

