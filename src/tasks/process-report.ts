import { TaskContext, Address } from "compose";
import { YEARN_VAULTS, getChain } from "../lib/config";

interface ProcessReportPayload {
  vault: string; // Required: vault name (e.g., "ygamiUSDC", "ymevUSDC", "ygami_scUSD")
  strategy: Address; // Required: strategy address to process report for
  chain?: string; // Optional: defaults to "avalanche"
}

export async function main(
  context: TaskContext,
  payload: ProcessReportPayload
): Promise<{
  txHash: string;
  chain: string;
  vault: string;
  strategy: Address;
}> {
  const { evm, logEvent } = context;
  const chainKey = payload.chain ?? "avalanche";
  const { vault, strategy } = payload;

  if (!vault) {
    throw new Error("vault name is required");
  }
  if (!strategy) {
    throw new Error("strategy address is required");
  }

  const chainVaults = YEARN_VAULTS[chainKey];
  if (!chainVaults) {
    throw new Error(`No vaults configured for chain: ${chainKey}`);
  }

  const vaultAddress = chainVaults[vault];
  if (!vaultAddress) {
    throw new Error(
      `Unknown vault "${vault}" for chain ${chainKey}. Available: ${Object.keys(
        chainVaults
      ).join(", ")}`
    );
  }

  const chain = getChain(chainKey, evm);
  const wallet = await evm.wallet({ name: "monet-vault-reporter" });

  const result = await wallet.writeContract(
    chain,
    vaultAddress,
    "process_report(address)",
    [strategy]
  );

  logEvent({
    code: "REPORT_PROCESSED",
    message: `Processed report for vault ${vault} on chain ${chainKey}`,
    data: JSON.stringify({
      chain: chainKey,
      vault,
      vaultAddress,
      strategy,
      txHash: result.hash,
    }),
  });

  return { txHash: result.hash, chain: chainKey, vault, strategy };
}
