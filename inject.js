const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.runtime.getURL('client.js'));
const head = document.head || document.getElementsByTagName('head')[0];
head.appendChild(script);
