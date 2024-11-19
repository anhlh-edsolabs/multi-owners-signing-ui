import { useEffect, useState } from "react";
import { Config } from "@wagmi/core";
import { useChainId, useChains } from "wagmi";

export function useConnectedChain() {
    const chainId = useChainId();
    const chains = useChains();
    const [connectedChain, setConnectedChain] = useState<
        Config["chains"][number] | null
    >(null);

    useEffect(() => {
        if (chains && chainId) {
            const matchedChain = chains.find((chain) => chain.id === chainId);
            if (matchedChain) {
                setConnectedChain(matchedChain);
            }
        }
    }, [chains, chainId]);

    console.log("Connected chain: ", connectedChain);

    return connectedChain;
}