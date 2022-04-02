import Decimal from 'decimal.js';

const ETHER = new Decimal(10).pow(18);

export function safeDecimal(value) {
  return new Decimal(value ?? 0);
}

export function ethNumberFixed(value) {
  return parseFloat(
    safeDecimal(value).div(ETHER).toFixed(6, Decimal.ROUND_DOWN),
  );
}
