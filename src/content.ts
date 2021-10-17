chrome.runtime.onMessage.addListener((request) => {
  if (request.type === 'shoot') {
    console.log('shoot!!')
  }
})
