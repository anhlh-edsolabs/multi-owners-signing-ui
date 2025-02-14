import { useEffect } from "react";
import { useChainId, useChains } from "wagmi";
import { useChainConnectionStore } from "./stores/useChainConnectionStore";

export function useConnectedChain() {
	const chainId = useChainId();
	const chains = useChains();

	const { connectedChain, setConnectedChain } = useChainConnectionStore();

	useEffect(() => {
		if (chains && chainId) {
			const matchedChain = chains.find((chain) => chain.id === chainId);
			if (matchedChain) {
				setConnectedChain(matchedChain);
			}
		}
	}, [chains, chainId, setConnectedChain]);

	return connectedChain;
}
