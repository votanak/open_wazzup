chrome.action.onClicked.addListener(async () => {
  // URL, с которого нужно получить authId
  const urlBitr =
    'https://labelectro.bitrix24.ru/marketplace/app/22/?bxrand=1736341289433';

  try {
    // Выполняем запрос на URL
    const response = await fetch(urlBitr, {
      headers: {
        accept: '*/*',
        'accept-language': 'ru,en;q=0.9',
        'bx-action-type': 'get_dynamic',
        'bx-cache-blocks':
          '{"title":"d41d8cd98f00","planner":"d41d8cd98f00","KWC0tw":"d41d8cd98f00","mdDGEd":"d41d8cd98f00","b24_helper":"d41d8cd98f00","fXCp1Q":"4a6d7c7c81be","4S5GL0":"ff2be46032b7","inline-scripts":"d41d8cd98f00","a7yhAS":"d41d8cd98f00","LkGdQn":"d41d8cd98f00","im":"d41d8cd98f00","workarea":"a71be6377dc3","g3dcTg":"d41d8cd98f00","otp-info":"d41d8cd98f00","ziLaXt":"d41d8cd98f00","xE9jIR":"d41d8cd98f00","kzNxZI":"d41d8cd98f00","03myIh":"d41d8cd98f00"}',
        'bx-cache-mode': 'HTMLCACHE',
        'bx-ref': 'https://labelectro.bitrix24.ru/marketplace/app/22/',
        priority: 'u=1, i',
        'sec-ch-ua':
          '"Chromium";v="130", "YaBrowser";v="24.12", "Not?A_Brand";v="99", "Yowser";v="2.5"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-bitrix-composite': 'get_dynamic',
      },
      referrer: 'https://labelectro.bitrix24.ru/marketplace/app/22/',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });

    // Проверяем, что ответ успешный
    if (!response.ok) {
      throw new Error('Ошибка сети: невозможно получить данные.');
    }

    // Получаем HTML-ответ в виде текста
    const html = await response.text();
    const decodedText = html.replace(/\\u0027/g, "'");
    console.log(decodedText);

    // Ищем authId с помощью регулярного выражения
    const authIdMatch = decodedText.match(/authId:\s*'([^']+)'/);

    if (authIdMatch && authIdMatch[1]) {
      // Извлекаем значение authId
      const authId = authIdMatch[1];
      console.log('authId:', authId); // Выводим authId в консоль для проверки

      // Создаём URL с параметром authId
      const url = chrome.runtime.getURL(
        `target.html?authId=${encodeURIComponent(authId)}`,
      );

      // Открываем новую вкладку с указанным URL
      chrome.tabs.create({ url });
    } else {
      console.error('authId не найден в ответе HTML.');
    }
  } catch (error) {
    // Обрабатываем любые ошибки
    console.error('Произошла ошибка при выполнении запроса:', error);
  }
});
