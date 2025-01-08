import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { AppKitNetwork, Chain, mainnet, sepolia } from "@reown/appkit/networks";
import { http, createConfig } from "@wagmi/core";

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID!;

// Create wagmiConfig
const metadata = {
	name: "Multi Owners signing",
	description: "Multi Owners signing",
	url: "https://web3modal.com", // origin must match your domain & subdomain
	icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [mainnet, sepolia];

const wagmiAdapter = new WagmiAdapter({
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

export const wagmiConfig = createConfig({
	chains: networks as unknown as readonly [Chain, ...Chain[]],
	transports: {
		[networks[0].id]: http(),
		[networks[1].id]: http(),
	},
});
