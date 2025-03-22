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
          localStorage.setItem("cart", JSON.stringify(cartItems));
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      }
}

//реализовать удаление, отображение в dropdown товаров