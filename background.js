chrome.action.onClicked.addListener(async () => {
  const actTab = await chrome.tabs.query({ active: true });
  const actTabId = actTab[0].id;

  // Получаем данные из активной вкладки
  chrome.scripting.executeScript(
    {
      target: { tabId: actTabId },
      func: () => {
        const iframe = document.querySelector(
          'iframe[src="/marketplace/app/22/?IFRAME=Y&IFRAME_TYPE=SIDE_SLIDER"]',
        );
        if (!iframe) return 'Iframe не найден';

        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        const input = iframeDoc.querySelector('input[name=AUTH_ID]');
        return input ? input.value : 'Элемент не найден';
      },
    },
    (results) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        return;
      }

      const authId = results[0]?.result || 'Нет данных';

      // Передаем authId через параметры URL
      const url = chrome.runtime.getURL(
        `target.html?authId=${encodeURIComponent(authId)}`,
      );
      chrome.tabs.create({ url });
    },
  );
});
