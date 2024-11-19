import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { AppKitNetwork, mainnet, sepolia } from "@reown/appkit/networks";

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
	networks,
	metadata,
	projectId,
	features: {
		analytics: false,
	}
}