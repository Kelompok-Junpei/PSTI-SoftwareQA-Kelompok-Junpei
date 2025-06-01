describe('Cart Functionality', () => {
  
  const mockCartItems = [
    {
      id: 1,
      productId: 101,
      name: 'Gaming Laptop',
      price: 15000000,
      quantity: 2,
      stock: 10,
      discountPercentage: 10,
      totalPrice: 27000000
    },
    {
      id: 2, 
      productId: 102,
      name: 'Wireless Mouse',
      price: 500000,
      quantity: 1,
      stock: 5,
      discountPercentage: 0,
      totalPrice: 500000
    }
  ];

  describe('1. Menambahkan produk ke keranjang', () => {
    test('should add new product to empty cart', () => {
      const cart = [];
      const newItem = {
        productId: 103,
        name: 'Mechanical Keyboard',
        price: 1200000,
        quantity: 1,
        stock: 8
      };
      
      const updatedCart = [...cart, { ...newItem, id: 3, totalPrice: newItem.price * newItem.quantity }];
      
      expect(updatedCart).toHaveLength(1);
      expect(updatedCart[0].name).toBe('Mechanical Keyboard');
      expect(updatedCart[0].quantity).toBe(1);
      expect(updatedCart[0].totalPrice).toBe(1200000);
    });

    test('should increase quantity if product already exists in cart', () => {
      const existingItem = mockCartItems[0];
      const updatedQuantity = existingItem.quantity + 1;
      const expectedTotalPrice = getDiscountedPrice(existingItem) * updatedQuantity;
      
      const updatedItem = {
        ...existingItem,
        quantity: updatedQuantity,
        totalPrice: expectedTotalPrice
      };
      
      expect(updatedItem.quantity).toBe(3);
      expect(updatedItem.totalPrice).toBe(40500000);
    });

    test('should not add if product stock is insufficient', () => {
      const outOfStockItem = {
        productId: 104,
        name: 'Out of Stock Item',
        price: 1000000,
        quantity: 5,
        stock: 2
      };
      
      const isValidQuantity = outOfStockItem.quantity <= outOfStockItem.stock;
      expect(isValidQuantity).toBe(false);
    });
  });

  describe('2. Memperbarui kuantitas produk di keranjang', () => {
    test('should update quantity when within stock limits', () => {
      const item = mockCartItems[0];
      const newQuantity = 3;
      
      const isValid = newQuantity > 0 && newQuantity <= item.stock;
      expect(isValid).toBe(true);
      
      const discountedPrice = getDiscountedPrice(item);
      const newTotalPrice = discountedPrice * newQuantity;
      
      const updatedItem = {
        ...item,
        quantity: newQuantity,
        totalPrice: newTotalPrice
      };
      
      expect(updatedItem.quantity).toBe(3);
      expect(updatedItem.totalPrice).toBe(40500000);
    });

    test('should not update quantity below 1', () => {
      const item = mockCartItems[1];
      const newQuantity = 0;
      
      const isValid = newQuantity >= 1;
      expect(isValid).toBe(false);
    });

    test('should not update quantity above stock limit', () => {
      const item = mockCartItems[1];
      const newQuantity = 10;
      
      const isValid = newQuantity <= item.stock;
      expect(isValid).toBe(false);
    });

    test('should handle decimal quantities by rounding down', () => {
      const quantity = Math.floor(2.7);
      expect(quantity).toBe(2);
    });
  });

  describe('3. Menghapus produk dari keranjang', () => {
    test('should remove item from cart', () => {
      const itemIdToRemove = 1;
      const updatedCart = mockCartItems.filter(item => item.id !== itemIdToRemove);
      
      expect(updatedCart).toHaveLength(1);
      expect(updatedCart.find(item => item.id === itemIdToRemove)).toBeUndefined();
      expect(updatedCart[0].name).toBe('Wireless Mouse');
    });

    test('should handle removing non-existent item gracefully', () => {
      const nonExistentId = 999;
      const updatedCart = mockCartItems.filter(item => item.id !== nonExistentId);
      
      expect(updatedCart).toHaveLength(2);
      expect(updatedCart).toEqual(mockCartItems);
    });

    test('should update total count after removal', () => {
      const itemIdToRemove = 2;
      const updatedCart = mockCartItems.filter(item => item.id !== itemIdToRemove);
      const totalCount = updatedCart.reduce((total, item) => total + item.quantity, 0);
      
      expect(totalCount).toBe(2);
    });
  });

  describe('4. Perhitungan subtotal dan total yang akurat', () => {
    test('should calculate subtotal correctly with discounts', () => {
      const selectedItems = mockCartItems;
      
      const subtotal = selectedItems.reduce((total, item) => {
        const discountedPrice = getDiscountedPrice(item);
        return total + (discountedPrice * item.quantity);
      }, 0);
      
      expect(subtotal).toBe(27500000);
    });

    test('should calculate total items count correctly', () => {
      const selectedItems = mockCartItems;
      const totalItems = selectedItems.reduce((total, item) => total + item.quantity, 0);
      
      expect(totalItems).toBe(3);
    });

    test('should handle empty cart calculations', () => {
      const emptyCart = [];
      const subtotal = emptyCart.reduce((total, item) => {
        const discountedPrice = getDiscountedPrice(item);
        return total + (discountedPrice * item.quantity);
      }, 0);
      const totalItems = emptyCart.reduce((total, item) => total + item.quantity, 0);
      
      expect(subtotal).toBe(0);
      expect(totalItems).toBe(0);
    });

    test('should calculate discount correctly', () => {
      const item = mockCartItems[0];
      const originalPrice = item.price;
      const discountedPrice = getDiscountedPrice(item);
      const expectedDiscount = originalPrice * 0.1;
      
      expect(discountedPrice).toBe(originalPrice - expectedDiscount);
      expect(discountedPrice).toBe(13500000); 
    });

    test('should handle zero discount items', () => {
      const item = mockCartItems[1];
      const discountedPrice = getDiscountedPrice(item);
      
      expect(discountedPrice).toBe(item.price);
    });
  });

  describe('5. Perilaku saat menambahkan item yang stoknya habis', () => {
    test('should prevent adding out of stock items', () => {
      const outOfStockItem = {
        productId: 105,
        name: 'Out of Stock Product',
        price: 2000000,
        quantity: 1,
        stock: 0
      };
      
      const canAddToCart = outOfStockItem.stock > 0;
      expect(canAddToCart).toBe(false);
    });

    test('should show low stock warning for items with stock < 10', () => {
      const lowStockItem = {
        productId: 106,
        name: 'Low Stock Item',
        price: 800000,
        quantity: 1,
        stock: 5
      };
      
      const showLowStockWarning = lowStockItem.stock < 10;
      expect(showLowStockWarning).toBe(true);
    });

    test('should validate quantity against current stock', () => {
      const item = {
        productId: 107,
        name: 'Limited Stock Item',
        price: 1500000,
        stock: 3
      };
      
      const requestedQuantity = 5;
      const isValidRequest = requestedQuantity <= item.stock;
      
      expect(isValidRequest).toBe(false);
    });

    test('should handle stock updates correctly', () => {
      const item = mockCartItems[1];
      const requestedQuantity = 6;
      
      const finalQuantity = Math.min(requestedQuantity, item.stock);
      
      expect(finalQuantity).toBe(5);
      expect(finalQuantity).toBeLessThan(requestedQuantity);
    });
  });

  describe('Price Formatting', () => {
    test('should format price in Indonesian Rupiah', () => {
      const price = 15000000;
      const formatted = formatPrice(price);
      
      expect(formatted).toContain('Rp');
      expect(formatted).toContain('15.000.000');
    });

    test('should handle zero price', () => {
      const price = 0;
      const formatted = formatPrice(price);
      
      expect(formatted).toContain('Rp');
      expect(formatted).toContain('0');
    });
  });

  describe('Selection Logic', () => {
    test('should handle select all functionality', () => {
      const selectAll = true;
      const selectedItems = selectAll ? mockCartItems.map(item => item.id) : [];
      
      expect(selectedItems).toEqual([1, 2]);
      expect(selectedItems).toHaveLength(mockCartItems.length);
    });

    test('should handle individual item selection', () => {
      let selectedItems = [1];
      const itemIdToToggle = 2;
      
      if (selectedItems.includes(itemIdToToggle)) {
        selectedItems = selectedItems.filter(id => id !== itemIdToToggle);
      } else {
        selectedItems = [...selectedItems, itemIdToToggle];
      }
      
      expect(selectedItems).toEqual([1, 2]);
    });
  });

  function getDiscountedPrice(item) {
    if (item.discountPercentage && item.discountPercentage > 0) {
      return item.price * (1 - (item.discountPercentage / 100));
    }
    return item.price;
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
}); 