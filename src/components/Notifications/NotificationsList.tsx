import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Clock } from 'lucide-react';
import { Notification } from '@/hooks/useInventory';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

export const NotificationsList = ({ notifications, onMarkAsRead }: NotificationsListProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <span>Recent Notifications</span>
          <Badge variant="secondary">{notifications.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No recent notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start justify-between p-4 border rounded-lg bg-card"
              >
                <div className="flex-1">
                  <p className="text-sm text-foreground">{notification.message}</p>
                  <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(notification.created_at)}</span>
                    <Badge 
                      variant={notification.status === 'unread' ? 'destructive' : 'secondary'}
                      className="ml-2"
                    >
                      {notification.status}
                    </Badge>
                  </div>
                </div>
                {notification.status === 'unread' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="ml-4"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};