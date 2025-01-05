chrome.action.onClicked.addListener(async () => {
  const bitrixTabId = await chrome.tabs.query(
    { url: 'https://labelectro.bitrix24.ru/marketplace/app/22/' },
    function (tabs) {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript(
        {
          target: { tabId },
          func: function () {
            const iframeDoc = document.querySelector(
              'iframe[src="/marketplace/app/22/?IFRAME=Y&IFRAME_TYPE=SIDE_SLIDER"]',
            ).contentDocument;
            console.log('iframe: ', iframeDoc);

            const input = iframeDoc.querySelector('input[name=AUTH_ID]');
            return input ? input.value : 'Элемент не найден';
          },
        },
        async (results) => {
          if (chrome.runtime.lastError) {
            console.error('Ошибка:', chrome.runtime.lastError.message);
          } else {
            // Открываем локальную страницу target.html
            const url = chrome.runtime.getURL('target.html');

            // Создаем новую вкладку с target.html
            const targetTab = await chrome.tabs.create({ url });

            // Ждем загрузки страницы и отправляем сообщение
            chrome.tabs.onUpdated.addListener(function listener(
              tabId,
              changeInfo,
            ) {
              if (tabId === targetTab.id && changeInfo.status === 'complete') {
                // Сообщение отправляется только после загрузки target.html
                chrome.tabs.sendMessage(
                  targetTab.id,
                  { text: results[0].result },
                  // (response) => {
                  //   if (chrome.runtime.lastError) {
                  //     console.error(
                  //       'Ошибка отправки сообщения:',
                  //       chrome.runtime.lastError.message,
                  //     );
                  //   } else {
                  //     console.log('Ответ от target.js:', response);
                  //   }
                  // },
                );
                chrome.tabs.onUpdated.removeListener(listener); // Удаляем слушатель
              }
            });
          }
        },
      );
    },
  );
});
