import { Car, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  notificationCount: number;
  onNotificationsClick: () => void;
}

export const Header = ({ notificationCount, onNotificationsClick }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <Car className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Tune Tech Motors</h1>
              <p className="text-sm text-muted-foreground">Inventory Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#dashboard" className="text-foreground hover:text-primary font-medium">
              Dashboard
            </a>
            <a href="#inventory" className="text-muted-foreground hover:text-primary">
              Parts Inventory
            </a>
            <a href="#reports" className="text-muted-foreground hover:text-primary">
              Reports
            </a>
          </nav>

          {/* Notifications */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onNotificationsClick}
              className="relative"
            >
              <Bell className="h-4 w-4" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};