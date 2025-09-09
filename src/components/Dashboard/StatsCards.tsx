import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, Clock } from 'lucide-react';
import { Part } from '@/hooks/useInventory';

interface StatsCardsProps {
  parts: Part[];
  lowStockCount: number;
}

export const StatsCards = ({ parts, lowStockCount }: StatsCardsProps) => {
  const totalParts = parts.length;
  const totalStock = parts.reduce((sum, part) => sum + part.quantity, 0);
  const lastUpdated = parts.length > 0 
    ? new Date(Math.max(...parts.map(p => new Date(p.last_updated || 0).getTime())))
    : new Date();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalParts}</div>
          <p className="text-xs text-muted-foreground">
            {totalStock} total units in stock
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{lowStockCount}</div>
          <p className="text-xs text-muted-foreground">
            Items below threshold
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lastUpdated.toLocaleDateString()}</div>
          <p className="text-xs text-muted-foreground">
            {lastUpdated.toLocaleTimeString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};