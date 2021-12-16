const BASE_URL = "https://api.coinpaprika.com/v1";

export function fetchCoins() {
  return fetch(`${BASE_URL}/coins`).then((response) => response.json());
}

export function fetchCoinInfo(cId: string) {
  return fetch(`${BASE_URL}/coins/${cId}`).then((response) => response.json());
}

export function fetchCoinTicker(cId: string) {
  return fetch(`${BASE_URL}/tickers/${cId}`).then((response) =>
    response.json()
  );
}

export function fetchCoinHistory(cId: string) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - 60 * 60 * 24 * 30;
  return fetch(
    `${BASE_URL}/coins/${cId}/ohlcv/historical?start=${startDate}&end=${endDate}`
  ).then((response) => response.json());
}
