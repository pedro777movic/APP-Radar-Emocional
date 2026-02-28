import { useEffect, useState, useCallback } from 'react';

// Simplified encryption simulation for the PIN
const encrypt = (val: string) => btoa(val);
const decrypt = (val: string) => {
  try {
    return atob(val);
  } catch {
    return '';
  }
};

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

const DEFAULT_PIN = '3344';
const ENCRYPTED_DEFAULT_PIN = encrypt(DEFAULT_PIN);

const DEFAULT_DATA: AppData = {
  pin: ENCRYPTED_DEFAULT_PIN,
  onboarded: false,
  sessions: [],
  completedPlanSteps: []
};

const STORAGE_KEY = 'radar_emocional_data_v2';

export function useLocalData() {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Migração/Validação básica
          const validated = {
            ...DEFAULT_DATA,
            ...parsed,
            pin: parsed.pin || ENCRYPTED_DEFAULT_PIN
          };
          setData(validated);
        } catch (e) {
          console.error('Failed to parse local data', e);
          setData(DEFAULT_DATA);
        }
      } else {
        setData(DEFAULT_DATA);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const updateData = useCallback((newData: Partial<AppData>) => {
    setData(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearData = useCallback(() => {
    setData(DEFAULT_DATA);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const setPin = useCallback((pin: string) => {
    updateData({ pin: encrypt(pin) });
  }, [updateData]);

  const verifyPin = useCallback((pin: string) => {
    if (!data.pin) return false;
    return decrypt(data.pin) === pin;
  }, [data.pin]);

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
