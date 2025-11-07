export interface ContextAction {
  icon?: string;
  label?: string;
  disabled?: boolean;
  divider?: boolean;
  action?: () => void;
}
