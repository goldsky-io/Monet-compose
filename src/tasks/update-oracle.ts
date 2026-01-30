import { TaskContext, Address } from "compose";
import { PARALLELIZER_USDP, getChain } from "../lib/config";

interface UpdateOraclePayload {
  collateral: Address; // Required: collateral address to update oracle for
  chain?: string; // Optional: defaults to "ethereum"
}

export async function main(
  context: TaskContext,
  payload: UpdateOraclePayload
): Promise<{ txHash: string; chain: string; collateral: Address }> {
  const { evm, logEvent } = context;
  const chainKey = payload.chain ?? "ethereum";
  const { collateral } = payload;

  if (!collateral) {
    throw new Error("collateral address is required");
  }

  const contractAddress = PARALLELIZER_USDP[chainKey];
  if (!contractAddress) {
    throw new Error(`Unsupported chain for updateOracle: ${chainKey}`);
  }

  const chain = getChain(chainKey, evm);
  const wallet = await evm.wallet({ name: "monet-oracle-updater" });

  const result = await wallet.writeContract(
    chain,
    contractAddress,
    "updateOracle(address)",
    [collateral]
  );

  logEvent({
    code: "ORACLE_UPDATED",
    message: `Updated oracle for collateral ${collateral} on chain ${chainKey}`,
    data: JSON.stringify({
      chain: chainKey,
      collateral,
      txHash: result.hash,
    }),
  });
  return { txHash: result.hash, chain: chainKey, collateral };
}
