export type AlertType = 'info' | 'warning' | 'critical' | 'success';

export interface SmartAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionType?: 'navigate_map' | 'reroute' | 'add_charger' | 'view_trips';
  actionData?: any;
}
