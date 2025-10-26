import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = 'http://192.168.0.107:5000'; // Update to your server URL

// --- Auth helper (if needed) ---
const getAuthToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

// --- Weather API ---
export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/weather?lat=${lat}&lon=${lon}`);
    return res.json();
  } catch (err) {
    console.error('Weather API error:', err);
    return null;
  }
};

// --- Mandi / Crop Prices API ---
export const fetchMandiPrices = async (state = '', commodity = '') => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/mandi?state=${encodeURIComponent(state)}&commodity=${encodeURIComponent(commodity)}`
    );
    return res.json();
  } catch (err) {
    console.error('Mandi API error:', err);
    return null;
  }
};
