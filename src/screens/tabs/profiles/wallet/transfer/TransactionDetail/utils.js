export const getAmountPrefix = (address, currentAddress) => {
  try {
    const add1 = address.toLowerCase();
    const add2 = currentAddress.toLowerCase();
    const current = add2.indexOf('0x') !== -1 ? add2 : '0x' + add2;
    if (add1 === current) {
      return '+';
    } else {
      return '-';
    }
  } catch (e) {
    console.log('getAmountPrefix', e);
  }
};
