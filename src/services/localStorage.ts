'use client';

export const localStorageService = ({method, key, value}: {method: string, key: string, value?: any}) => {
    if (method === "get") {
      const storedValue = localStorage.getItem(key);
      if (storedValue) {
        try {
          const parsedValue = JSON.parse(storedValue);
          if (Array.isArray(parsedValue)) {
            return parsedValue.map((item: string) => JSON.parse(item));
          }
          return parsedValue;
        } catch (error) {
          console.error("Ошибка при парсинге данных из localStorage", error);
          return null;
        }
      }
      return null;
    }

    if (method === "set") {
      console.log('set');
      if (key === "cart") {
        const existingCart = localStorage.getItem("cart");
        const cartItems = existingCart ? JSON.parse(existingCart) : [];
        
        cartItems.push(value);
        console.log('jsoned set', JSON.stringify(cartItems));
        localStorage.setItem("cart", JSON.stringify(cartItems));
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }

    if (method === "remove") {
      console.log('remove');
      if (key === "cart" && value?.id) {
          const existingCart = localStorage.getItem("cart");
          if (existingCart) {
              const cartItems = JSON.parse(existingCart);
              const updatedCart = cartItems.filter((item: string) => {
                  try {
                      const parsedItem = JSON.parse(item);
                      return parsedItem.id !== value.id;
                  } catch (error) {
                      console.error("Ошибка при парсинге элемента корзины", error);
                      return true;
                  }
              });
  
              console.log('updatedCart', updatedCart);
              console.log('jsoned', JSON.stringify(updatedCart));
              localStorage.setItem("cart", JSON.stringify(updatedCart));
          }
      }
    }
  

}

//реализовать удаление, отображение в dropdown товаров