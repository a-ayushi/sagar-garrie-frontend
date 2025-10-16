import { menuAPI } from './api';

// Menu service with business logic
export class MenuService {
  // Get all menu items
  static async getAllMenuItems() {
    try {
      const menuItems = await menuAPI.getMenuItems();
      return {
        success: true,
        data: menuItems,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Get menu items by category
  static async getMenuItemsByCategory(category) {
    try {
      const menuItems = await menuAPI.getMenuItems(category);
      return {
        success: true,
        data: menuItems,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Get available categories from menu items
  static async getCategories() {
    try {
      const menuItems = await menuAPI.getMenuItems();
      const categories = [...new Set(menuItems.map(item => item.category))];
      return {
        success: true,
        data: categories,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: [],
      };
    }
  }

  // Format menu item for display
  static formatMenuItem(item) {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      isVegetarian: item.veg,
      imageUrl: item.imageUrl,
      formattedPrice: `$${item.price.toFixed(2)}`,
    };
  }

  // Group menu items by category
  static groupMenuItemsByCategory(menuItems) {
    return menuItems.reduce((groups, item) => {
      const category = item.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(this.formatMenuItem(item));
      return groups;
    }, {});
  }

  // Search menu items
  static searchMenuItems(menuItems, searchTerm) {
    if (!searchTerm) return menuItems;
    
    const term = searchTerm.toLowerCase();
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
  }

  // Filter menu items by dietary preferences
  static filterMenuItems(menuItems, filters = {}) {
    let filtered = [...menuItems];

    if (filters.vegetarianOnly) {
      filtered = filtered.filter(item => item.veg);
    }

    if (filters.category) {
      filtered = filtered.filter(item => 
        item.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(item => item.price <= filters.maxPrice);
    }

    return filtered;
  }
}

export default MenuService;
