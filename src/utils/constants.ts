export const getColorCode = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'black': '#000000',
    'white': '#ffffff',
    'red': '#ff0000',
    'blue': '#0000ff',
    'green': '#008000',
    'yellow': '#ffff00',
    'purple': '#800080',
    'pink': '#ffc0cb',
    'gold': '#ffd700',
    'silver': '#c0c0c0',
    'graphite': '#333333',
    'gray': '#808080',
    'space gray': '#676767',
    'midnight': '#121212',
    'starlight': '#f9f3ee',
    'product red': '#ff0000',
    'desert titanium': '#d5c4b0',
    'natural titanium': '#c0bcb1',
    'black titanium': '#232323',
    'white titanium': '#e8e8e8',
  };
  
  const lowerColor = colorName.toLowerCase();
  return colorMap[lowerColor] || '#cccccc'; // Default gray if color not found
};

export const footerLinks = [
    { "title": "iPhone", "href": "#" },
    { "title": "iPad", "href": "#" },
    { "title": "Mac", "href": "#" },
    { "title": "Apple Watch", "href": "#" },
    { "title": "AirPods", "href": "#" },
    { "title": "Гаджети", "href": "#" },
    { "title": "Аксесуари", "href": "#" },
    { "title": "Веснянi знижки", "href": "#" },
    { "title": "Dyson", "href": "#" },
    { "title": "Samsung Galaxy", "href": "#" },
    { "title": "Смартфони", "href": "#" },
    { "title": "Смарт-годинники", "href": "#" },
    { "title": "Телевiзори", "href": "#" },
    { "title": "Планшети", "href": "#" },
    { "title": "Консолi та геймiнг", "href": "#" },
    { "title": "Ноутбуки", "href": "#" },
    { "title": "ПК та аксесуари", "href": "#" },
    { "title": "Технiка для дому", "href": "#" },
    { "title": "Краса та здоров'я", "href": "#" },
    { "title": "Розумний дiм", "href": "#" },
    { "title": "Фото та аудiо", "href": "#" }
];

export const phoneNumber = '0 800 33 75 21';
export const email = 'info@jabko.ua';