import { create } from "zustand";
import { Chain } from "viem";

interface ChainConnectionStore {
    connectedChain: Chain | null;
    setConnectedChain: (connectedChain: Chain | null) => void;
}

const useChainConnectionStore = create<ChainConnectionStore>((set) => ({
    connectedChain: null,
    setConnectedChain: (connectedChain) => set({ connectedChain }),
}));

export { useChainConnectionStore };