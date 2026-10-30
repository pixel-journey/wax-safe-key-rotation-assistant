export const RPC_ENDPOINTS = [
  { id: "greymass", label: "Greymass", url: "https://wax.greymass.com" },
  { id: "eosrio", label: "EOSrio", url: "https://wax.eosrio.io" },
  { id: "eosphere", label: "EOSphere", url: "https://wax.eosphere.io" },
  { id: "pink", label: "Pink.gg", url: "https://wax.pink.gg" },
] as const;

export const DEFAULT_RPC_URL = RPC_ENDPOINTS[0].url;
