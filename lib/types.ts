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
  parent: string | null;
  threshold: number;
  keys: AuthKey[];
  accounts: AuthAccount[];
}

export interface PermissionGraph {
  account: string;
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

export interface RotationState {
  account: string;
  currentPermissions: PermissionGraph | null;
  targetPermission: "owner" | "active";
  newKeys: KeyInput[];
  step: number;
  warnings: ChangeWarning[];
  multiSigRequirements: string[];
}
