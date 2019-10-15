export const shortenEthAddr = (str) => {
  const shortenStr = str && `${str.substring(0, 5)}...${str.substring(str.length - 5, str.length)}`;
  return shortenStr;
};

export const timeSince = (date) => {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval === 1) return interval + " year";
  if (interval > 1) return interval + " years";

  interval = Math.floor(seconds / 2592000);
  if (interval === 1) return interval + " month";
  if (interval > 1) return interval + " months";

  interval = Math.floor(seconds / 86400);
  if (interval === 1) return interval + " day";
  if (interval > 1) return interval + " days";

  interval = Math.floor(seconds / 3600);
  if (interval === 1) return interval + " hour";
  if (interval > 1) return interval + " hours";

  interval = Math.floor(seconds / 60);
  if (interval === 1) return interval + " minute";
  if (interval > 1) return interval + " minutes";

  return Math.floor(seconds) + " seconds";
}

export const sortChronologicallyAndGroup = (threadPosts) => {
  const updatedThreadPosts = threadPosts.sort((a, b) => {
    a = a.timestamp;
    b = b.timestamp;
    return a > b ? 1 : a < b ? -1 : 0;
  });

  const groupedThreadPosts = [];
  let groupedIndex = -1;

  updatedThreadPosts.forEach((post) => {
    if (groupedIndex === -1 || groupedThreadPosts[groupedIndex][groupedThreadPosts[groupedIndex].length - 1].author !== post.author) {
      groupedIndex += 1;
      groupedThreadPosts[groupedIndex] = [];
      groupedThreadPosts[groupedIndex].push(post);
    } else {
      groupedThreadPosts[groupedIndex].push(post);
    }
  });

  return groupedThreadPosts;
}

export const checkIsMobileDevice = () => {
  return ((window && typeof window.orientation !== "undefined")) || (navigator && navigator.userAgent.indexOf('IEMobile') !== -1);
};

export const getCurrentProvider = (ethereum) => {
  if (!window.web3) return 'unknown';

  if (ethereum.isMetaMask)
      return 'metamask';

  if (ethereum.isTrust)
      return 'trust';

  if (ethereum.isGoWallet)
      return 'goWallet';

  if (ethereum.isAlphaWallet)
      return 'alphaWallet';

  if (ethereum.isStatus)
      return 'status';

  if (ethereum.isToshi)
      return 'coinbase';

  if (typeof window.__CIPHER__ !== 'undefined')
      return 'cipher';

  if (ethereum.constructor.name === 'EthereumProvider')
      return 'mist';

  if (ethereum.constructor.name === 'Web3FrameProvider')
      return 'parity';

  if (ethereum.host && ethereum.host.indexOf('infura') !== -1)
      return 'infura';

  if (ethereum.host && ethereum.host.indexOf('localhost') !== -1)
      return 'localhost';
  
  return 'unknown';
}