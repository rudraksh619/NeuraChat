import { WebContainer } from '@webcontainer/api';

let WebContainerInstance = null;
let bootPromise = null;

export const getwebcontainer = async () => {
  if (WebContainerInstance) {
    return WebContainerInstance;
  }

  // If already booting, return the same promise
  if (bootPromise) {
    return bootPromise;
  }

  // Boot and cache the promise
  bootPromise = WebContainer.boot().then(container => {
    WebContainerInstance = container;
    return container;
  });

  return bootPromise;
};
