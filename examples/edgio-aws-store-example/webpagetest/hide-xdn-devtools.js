/**
 * Put on: WPT -> Advanced -> Inject Script
 */
const modalCleanupInterval = setInterval(() => {
  console.log('modalCleanupInterval: checking...')
  const $node = document.querySelector('.layer0-devtools-reset-style');
  if ($node) {
    console.log('modalCleanupInterval: modal found. removing it...')
    $node.remove();
    clearInterval(modalCleanupInterval);
  }
}, 100);
