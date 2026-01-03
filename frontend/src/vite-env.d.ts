/// <reference types="vite/client" />

interface Window
{
    ethereum: {
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
        isMetaMask?: boolean
        on?: (event: string, handler: (...args: unknown[]) => void) => void
    }
}
