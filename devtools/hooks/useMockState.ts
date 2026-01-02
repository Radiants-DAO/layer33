import { useDevToolsStore } from '../store';

export function useMockState<T = unknown>(category: string): T | undefined {
  // Always call hooks unconditionally - React hooks rule
  const mockStates = useDevToolsStore((state) => state.mockStates);
  
  // In production, always return undefined
  if (process.env.NODE_ENV === 'production') {
    return undefined;
  }

  const activeState = mockStates.find(
    (s) => s.category === category && s.active
  );

  return activeState?.values as T | undefined;
}

