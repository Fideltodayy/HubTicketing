import { useCallback } from "react";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import { LifecycleStatus } from "@coinbase/onchainkit/pay";
import { Wallet, ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { contracts } from "./contracts";

export default function TransactionComponents() {
  const { address } = useAccount();

  const handleOnStatus = useCallback((LifecycleStatus) => {
    console.log("LifecycleStatus", LifecycleStatus);
  }, []);

  return address ? (
    <Transaction
      chainId={BASE_SEPOLIA_CHAIN_ID}
      contracts={contracts}
      onStatus={handleOnStatus}
    >
      <TransactionButton />
      <TransactionSponsor />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  ) : (
    <Wallet>
      <ConnectWallet>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
    </Wallet>
  );
}
