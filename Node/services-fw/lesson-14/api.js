export default {
    checkPalindrome: (text) => {
      const clean = text.toLowerCase().replace(/[^a-zа-я0-9]/g, '');
      return clean === clean.split('').reverse().join('');
    }
  };