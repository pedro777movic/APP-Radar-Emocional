import { useEffect, useState } from 'react';

// Simplified encryption simulation for the PIN
const encrypt = (val: string) => btoa(val);
const decrypt = (val: string) => atob(val);

export type QuizResponse = {
  questionId: string;
  value: number;
};

export type Session = {
  id: string;
  timestamp: number;
  score: number;
  label: 'low' | 'medium' | 'high';
  responses: QuizResponse[];
};

export type AppData = {
  pin: string | null;
  onboarded: boolean;
  sessions: Session[];
  completedPlanSteps: string[];
};

const DEFAULT_DATA: AppData = {
  pin: null,
  onboarded: false,
  sessions: [],
  completedPlanSteps: []
};

const STORAGE_KEY = 'radar_emocional_data';

export function useLocalData() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse local data', e);
      }
    }
    setLoading(false);
  }, []);

  const updateData = (newData: Partial<AppData>) => {
    const updated = { ...data, ...newData };
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearData = () => {
    setData(DEFAULT_DATA);
    localStorage.removeItem(STORAGE_KEY);
  };

  const setPin = (pin: string) => {
    updateData({ pin: encrypt(pin) });
  };

  const verifyPin = (pin: string) => {
    if (!data.pin) return false;
    return decrypt(data.pin) === pin;
  };

  return {
    data,
    loading,
    updateData,
    clearData,
    setPin,
    verifyPin,
    hasPin: !!data.pin
  };
}
