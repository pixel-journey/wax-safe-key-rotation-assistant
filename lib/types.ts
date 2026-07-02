import { PermissionGraph } from '../types/permission'; // Can import from companion if monorepo later

export interface KeyInput {
  key: string;
  weight: number;
}

export interface RotationState {
  account: string;
  currentPermissions: PermissionGraph | null;
  targetPermission: 'owner' | 'active';
  newKeys: KeyInput[];
  step: number;
  warnings: Array<{ level: 'safe' | 'warning' | 'danger'; message: string }>;
  multiSigRequirements: string[];
}

export interface ChangeWarning {
  level: 'safe' | 'warning' | 'danger';
  message: string;
  affectedPermission?: string;
}
