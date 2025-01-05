// Обработка сообщений от фонового скрипта
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Сообщение получено на target.html:', message.text);
  // Отправляем сообщение через window.postMessage для демонстрации
  window.postMessage({ text: message.text }, '*');
  zapros(message.text);
});

const zapros = async (authId) => {
  try {
    const response = await fetch(
      'https://integrations.wazzup24.com/bitrix/connect?DOMAIN=labelectro.bitrix24.ru&PROTOCOL=1&LANG=ru&APP_SID=cd27c026457240cfe9fd0cb79feba342',
      {
        method: 'POST',
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          AUTH_ID: authId,
          AUTH_EXPIRES: '3333600',
          REFRESH_ID:
            '1b9a9b6700220330005190e400000008000007998b399dccf8578b00c1a71408c98eff',
          member_id: 'dbfea47052b504cb009720d53658bfaa',
          status: 'F',
          PLACEMENT: 'DEFAULT',
          PLACEMENT_OPTIONS: JSON.stringify({
            IFRAME: 'Y',
            IFRAME_TYPE: 'SIDE_SLIDER',
            any: '22/',
          }),
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const html = await response.text();
    responseContainer.innerHTML += html;
  } catch (error) {
    responseContainer.innerHTML += `<p>Ошибка: ${error.message}</p>`;
  }
};
