/** Educational permission snapshot for rotation safety checks. */

export interface AuthKey {
  key: string;
  weight: number;
}

export interface AuthAccount {
  permission: { actor: string; permission: string };
  weight: number;
}

export interface PermissionNode {
  name: string;
  parent?: string | null;
  threshold: number;
  keys: AuthKey[];
  accounts: AuthAccount[];
}

export interface PermissionGraph {
  account: string;
  lastUpdated?: string;
  permissions: Record<string, PermissionNode>;
}

export interface KeyInput {
  key: string;
  weight: number;
}

export interface ChangeWarning {
  level: "safe" | "warning" | "danger";
  message: string;
  affectedPermission?: string;
}

export interface UpdateAuthSketch {
  account: string;
  permission: "owner" | "active";
  parent: string;
  threshold: number;
  keys: KeyInput[];
  note: string;
}
