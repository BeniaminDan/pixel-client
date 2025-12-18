/**
 * @fileoverview Defines a Zustand store for managing a simple counter state.
 *
 * This store encapsulates the state (`count`) and the actions (`increment`, `decrement`, `reset`)
 * that can modify that state. Zustand automatically creates the necessary hooks for
 * consuming this state throughout your application.
 *
 * @usage
 * // 1. Access the state and actions in a component:
 * import { useCounterStore } from '@/stores';
 *
 * function MyComponent() {
 * const count = useCounterStore(state => state.count);
 * const { increment } = useCounterStore(); // Destructure actions separately
 *
 * return (* <div>
 * <p>Count: {count}</p>
 * <button onClick={increment}>Increment</button>
 * </div> *);
 * }
 */
import { create } from 'zustand';

// 1. Define the shape of the state (data)
interface CounterState {
    count: number;
}

// 2. Define the shape of the actions (functions)
interface CounterActions {
    increment: (by?: number) => void;
    decrement: (by?: number) => void;
    reset: () => void;
}

// Combine state and actions into the store's type
type CounterStore = CounterState & CounterActions;

// 3. Create the store instance
export const useCounterStore = create<CounterStore>((set) => ({
    // --- Initial State ---
    count: 0,

    // --- Actions ---
    increment: (by = 1) =>
        set((state) => ({
            count: state.count + by,
        })),

    decrement: (by = 1) =>
        set((state) => ({
            count: state.count - by,
        })),

    reset: () =>
        set({
            count: 0,
        }),
}));
