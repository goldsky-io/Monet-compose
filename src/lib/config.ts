import { Address, AvailableChains, Chain } from "compose";

// Custom chain definitions for chains not in viem
export const SONIC_CHAIN: Chain = {
  id: 146,
  name: "Sonic",
  nativeCurrency: { name: "Sonic", symbol: "S", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.soniclabs.com"] },
  },
  blockExplorers: {
    default: { name: "SonicScan", url: "https://sonicscan.org" },
  },
};

export const HYPEREVM_CHAIN: Chain = {
  id: 999,
  name: "HyperEVM",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid.xyz/evm"] },
  },
  blockExplorers: {
    default: { name: "HyperEVM Scan", url: "https://hyperevmscan.io" },
  },
};

// Chain configs - maps chain key to either a built-in chain or custom chain
export type ChainConfig =
  | { chain: keyof AvailableChains; custom?: never }
  | { chain?: never; custom: Chain };

export const CHAIN_CONFIG: Record<string, ChainConfig> = {
  ethereum: { chain: "ethereum" },
  base: { chain: "base" },
  avalanche: { chain: "avalanche" },
  sonic: { custom: SONIC_CHAIN },
  hyperevm: { custom: HYPEREVM_CHAIN },
};

// ParallelizerUSDp (SettersGovernor proxy) addresses per chain - for updateOracle
export const PARALLELIZER_USDP: Record<string, Address> = {
  ethereum: "0x6efeDDF9269c3683Ba516cb0e2124FE335F262a2",
  base: "0xC3BEF21Ea7dEB5C34CF33E918c8e28972C8048eD",
  sonic: "0xBEFBAe2330186F031b469e26283aCc66bb5F8826",
  hyperevm: "0x1250304F66404cd153fA39388DDCDAec7E0f1707",
  avalanche: "0x41d58951cbd12d4ef49b0437897677bbf5547c80",
};

// Yearn V3 Vault addresses per chain - for process_report
export const YEARN_VAULTS: Record<string, Record<string, Address>> = {
  sonic: {
    ygami_scUSD: "0xa19ebd8f9114519bf947671021c01d152c3777e4",
  },
  avalanche: {
    ygamiUSDC: "0x9fd32fd5e32c6b95483d36c5e724c5c5250ce010",
    ymevUSDC: "0x7aca67a6856bf532a7b2dea9b20253f08bc9a85a",
  },
};

// Helper to get the chain object for a given chain key
export function getChain(
  chainKey: string,
  evm: { chains: Record<keyof AvailableChains, Chain> },
): Chain {
  const config = CHAIN_CONFIG[chainKey];
  if (!config) {
    throw new Error(`Unknown chain: ${chainKey}`);
  }
  if (config.custom) {
    return config.custom;
  }
  return evm.chains[config.chain];
}
