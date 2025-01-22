import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { AppKitNetwork } from "@reown/appkit/networks";
import { mainnet, sepolia } from "@wagmi/core/chains";
// import { createConfig, http } from "@wagmi/core";

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID!;

// Create wagmiConfig
const metadata = {
	name: "Multi Owners signing",
	description: "Multi Owners signing",
	url: "https://web3modal.com", // origin must match your domain & subdomain
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, sepolia];

export const wagmiAdapter = new WagmiAdapter({
	networks,
	projectId,
	ssr: true,
});

export const config = {
	adapters: [wagmiAdapter],
	defaultNetwork: mainnet,
	networks,
	metadata,
	projectId,
	features: {
		analytics: false,
	},
};

export const wagmiConfig = wagmiAdapter.wagmiConfig;
