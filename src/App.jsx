import { useState } from "react";
import { base } from "viem/chains";
import { WagmiProvider } from "wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import "@coinbase/onchainkit/styles.css";
import { WalletDefault } from "@coinbase/onchainkit/wallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import getConfig from "./config/wagmi";
import TechHubProgramBooking from "./components/TechHubProgramBooking";
import { useAccount } from "wagmi";

const App = () => {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey="3_vAqOchZPcHWK8VrICw0_Gor7CUlH97"
          chain={base}
        >
          <AppContent />
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const AppContent = () => {
  const { isConnected } = useAccount();

  return (
    <div className="p-6">
      {isConnected ? (
        <TechHubProgramBooking />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen ">
          <h1 className="text-4xl font-bold mb-6 text-black">
            Welcome to ALX Hub Ticketing Platform
          </h1>
          <p className="text-xl mb-8 text-black">
            Connect your smart wallet to get started
          </p>
          <div className="bg-white  transition-colors">
            <WalletDefault />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
