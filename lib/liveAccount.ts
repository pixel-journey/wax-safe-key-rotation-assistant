import type { PermissionGraph, PermissionNode } from "./types";

export const DEFAULT_RPC = "https://wax.greymass.com";

interface ChainPermission {
  perm_name: string;
  parent: string;
  required_auth: {
    threshold: number;
    keys: { key: string; weight: number }[];
    accounts: {
      permission: { actor: string; permission: string };
      weight: number;
    }[];
  };
}

export function mapGetAccount(data: {
  account_name: string;
  permissions?: ChainPermission[];
}): PermissionGraph {
  const permissions: Record<string, PermissionNode> = {};
  for (const p of data.permissions || []) {
    permissions[p.perm_name] = {
      name: p.perm_name,
      parent: p.parent || null,
      threshold: p.required_auth?.threshold ?? 1,
      keys: (p.required_auth?.keys || []).map((k) => ({
        key: k.key,
        weight: k.weight,
      })),
      accounts: (p.required_auth?.accounts || []).map((a) => ({
        permission: a.permission,
        weight: a.weight,
      })),
    };
  }
  return {
    account: data.account_name,
    lastUpdated: new Date().toISOString(),
    permissions,
  };
}

export async function fetchPermissionGraphSafe(
  account: string,
  rpcBase = DEFAULT_RPC
): Promise<
  | { ok: true; graph: PermissionGraph; source: string }
  | { ok: false; reason: string }
> {
  const name = account.trim().toLowerCase();
  if (!name) return { ok: false, reason: "Account required" };
  const url = `${rpcBase.replace(/\/$/, "")}/v1/chain/get_account`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ account_name: name }),
    });
    if (!res.ok) return { ok: false, reason: `RPC ${res.status}` };
    const data = (await res.json()) as {
      account_name?: string;
      permissions?: ChainPermission[];
    };
    if (!data.account_name) return { ok: false, reason: "Unexpected response" };
    return {
      ok: true,
      graph: mapGetAccount(data as { account_name: string; permissions?: ChainPermission[] }),
      source: url,
    };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "fetch failed",
    };
  }
}
