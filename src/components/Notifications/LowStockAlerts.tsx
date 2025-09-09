import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package } from 'lucide-react';
import { Part } from '@/hooks/useInventory';

interface LowStockAlertsProps {
  getLowStockParts: () => Promise<Part[]>;
}

export const LowStockAlerts = ({ getLowStockParts }: LowStockAlertsProps) => {
  const [lowStockParts, setLowStockParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStockParts = async () => {
      setLoading(true);
      try {
        const parts = await getLowStockParts();
        setLowStockParts(parts);
      } catch (error) {
        console.error('Error fetching low stock parts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockParts();
  }, [getLowStockParts]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span>Low Stock Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <span>Low Stock Alerts</span>
          <Badge variant="destructive">{lowStockParts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockParts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 text-success" />
            <p>All parts are sufficiently stocked!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lowStockParts.map((part) => {
              const urgencyLevel = part.quantity <= part.min_threshold * 0.5 ? 'high' : 'medium';
              const stockPercentage = (part.quantity / part.min_threshold) * 100;
              
              return (
                <div
                  key={part.id}
                  className={`p-4 rounded-lg border ${
                    urgencyLevel === 'high' 
                      ? 'border-destructive bg-destructive/5' 
                      : 'border-warning bg-warning/5'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{part.part_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Part #: {part.part_number || 'N/A'}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-sm">
                          <strong>{part.quantity}</strong> units left
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Threshold: {part.min_threshold}
                        </span>
                      </div>
                      {part.supplier_name && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Supplier: {part.supplier_name}
                          {part.supplier_contact && ` (${part.supplier_contact})`}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge 
                        variant={urgencyLevel === 'high' ? 'destructive' : 'secondary'}
                      >
                        {urgencyLevel === 'high' ? 'Critical' : 'Low Stock'}
                      </Badge>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {stockPercentage.toFixed(0)}% of threshold
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};