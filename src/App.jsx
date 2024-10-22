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
          <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
            <AppContent />
          </div>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const AppContent = () => {
  const { isConnected } = useAccount();

  return (
    <div className="container mx-auto px-4 py-8">
      {isConnected ? (
        <TechHubProgramBooking />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Welcome to ALX Hub Ticketing Platform
          </h1>
          <p className="text-lg sm:text-xl mb-8 text-gray-600 max-w-md">
            Connect your smart wallet to get started with booking tech programs
            and managing your tickets.
          </p>
          <div className=" rounded-lg p-6 ">
            <WalletDefault />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
