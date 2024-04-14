import { ENV_URL } from '../config';

export const API_BASE_URL = ENV_URL;

export const isServerAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(ENV_URL);
    return response.ok; // Returns true if the status is 2xx, false otherwise.
  } catch (error) {
    console.error('Error checking server availability:', error);
    return false;
  }
};