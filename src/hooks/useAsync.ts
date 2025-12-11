/**
 * @fileoverview Hook to run async tasks with simple status tracking.
 *
 * @example
 * const { data, error, isLoading, run } = useAsync<User>();
 * useEffect(() => {
 *   run(() => apiClient.get('/me').then(res => res.data));
 * }, [run]);
 */

import { useCallback, useState } from 'react';

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

interface AsyncState<T> {
    data?: T;
    error?: unknown;
    status: AsyncStatus;
}

export const useAsync = <T,>() => {
    const [state, setState] = useState<AsyncState<T>>({
        status: 'idle',
    });

    const run = useCallback(async (task: () => Promise<T>) => {
        setState((prev) => ({ ...prev, status: 'pending', error: undefined }));

        try {
            const result = await task();
            setState({ data: result, status: 'success', error: undefined });
            return result;
        } catch (error) {
            setState({ data: undefined, status: 'error', error });
            throw error;
        }
    }, []);

    const reset = useCallback(() => {
        setState({ status: 'idle', data: undefined, error: undefined });
    }, []);

    return {
        ...state,
        isLoading: state.status === 'pending',
        isSuccess: state.status === 'success',
        isError: state.status === 'error',
        run,
        reset,
    };
};
