import { MantineProvider } from "@mantine/core";
import { createAppKit } from "@reown/appkit/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { WagmiProvider } from "wagmi";
import { config } from "./common/config";

const queryClient = new QueryClient();

createAppKit(config);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<WagmiProvider config={config.adapters[0].wagmiConfig}>
		<QueryClientProvider client={queryClient}>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{ loader: "dots" }}
			>
				<App />
			</MantineProvider>
		</QueryClientProvider>
	</WagmiProvider>,
);
