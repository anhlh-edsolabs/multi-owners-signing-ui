import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";

import { config } from "./common/config.ts";
import { WagmiProvider } from "wagmi";

console.log(
	"WALLET_CONNECT_PROJECT_ID",
	import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
);
const queryClient = new QueryClient();
createWeb3Modal({
	wagmiConfig: config,
	projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID!,
	enableAnalytics: true, // Optional - defaults to your Cloud configuration
	enableOnramp: true, // Optional - false as default
});
ReactDOM.createRoot(document.getElementById("root")!).render(
	<QueryClientProvider client={queryClient}>
		<WagmiProvider config={config}>
			<MantineProvider withGlobalStyles withNormalizeCSS>
				<App />
			</MantineProvider>
		</WagmiProvider>
	</QueryClientProvider>,
);
