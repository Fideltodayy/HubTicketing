import React, { useState, useEffect } from "react";
import { useAccount, useBalance, useContractRead } from "wagmi";
import { parseEther } from "viem";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// This is a mock ABI for the ticket contract. You'll need to replace this with your actual contract ABI.
const ticketABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

const EnhancedWallet = ({ ticketContractAddress }) => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { data: ticketBalance } = useContractRead({
    address: ticketContractAddress,
    abi: ticketABI,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: ticketURI, refetch: refetchTicketURI } = useContractRead({
    address: ticketContractAddress,
    abi: ticketABI,
    functionName: "tokenURI",
    args: [selectedTicket],
    enabled: selectedTicket !== null,
  });

  useEffect(() => {
    if (ticketURI) {
      // Here you would typically fetch the metadata from the URI
      // For this example, we'll just use the URI as is
      console.log("Ticket URI:", ticketURI);
    }
  }, [ticketURI]);

  const handleSelectTicket = (tokenId) => {
    setSelectedTicket(tokenId);
    refetchTicketURI();
  };

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Address: {address}</p>
        <p>
          Balance:{" "}
          {balance
            ? `${parseEther(balance.value.toString())} ${balance.symbol}`
            : "Loading..."}
        </p>
        <p>
          Tickets: {ticketBalance ? ticketBalance.toString() : "Loading..."}
        </p>

        {ticketBalance && parseInt(ticketBalance.toString()) > 0 && (
          <div>
            <h3>Your Tickets:</h3>
            {[...Array(parseInt(ticketBalance.toString()))].map((_, index) => (
              <Button
                key={index}
                onClick={() => handleSelectTicket(index)}
                className="mr-2 mb-2"
              >
                Ticket #{index + 1}
              </Button>
            ))}
          </div>
        )}

        {selectedTicket !== null && ticketURI && (
          <div className="mt-4">
            <h3>Selected Ticket:</h3>
            <p>Token ID: {selectedTicket}</p>
            <p>URI: {ticketURI}</p>
            <QRCodeSVG value={ticketURI} size={128} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedWallet;
