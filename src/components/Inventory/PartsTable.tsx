import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Minus, Plus } from 'lucide-react';
import { Part } from '@/hooks/useInventory';

interface PartsTableProps {
  parts: Part[];
  onEditPart: (part: Part) => void;
  onDeletePart: (id: number) => void;
  onUpdateStock: (id: number, quantity: number) => void;
}

export const PartsTable = ({ parts, onEditPart, onDeletePart, onUpdateStock }: PartsTableProps) => {
  const [stockUpdates, setStockUpdates] = useState<{ [key: number]: number }>({});

  const handleStockChange = (partId: number, change: number) => {
    const part = parts.find(p => p.id === partId);
    if (!part) return;
    
    const currentStock = stockUpdates[partId] ?? part.quantity;
    const newStock = Math.max(0, currentStock + change);
    setStockUpdates(prev => ({ ...prev, [partId]: newStock }));
  };

  const handleStockUpdate = (partId: number) => {
    const newStock = stockUpdates[partId];
    if (newStock !== undefined) {
      onUpdateStock(partId, newStock);
      setStockUpdates(prev => {
        const updated = { ...prev };
        delete updated[partId];
        return updated;
      });
    }
  };

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity <= threshold) {
      return { label: 'Low Stock', variant: 'destructive' as const };
    } else if (quantity <= threshold * 1.5) {
      return { label: 'Warning', variant: 'secondary' as const };
    }
    return { label: 'In Stock', variant: 'default' as const };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parts Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Name</TableHead>
                <TableHead>Part Number</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Threshold</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parts.map((part) => {
                const currentStock = stockUpdates[part.id] ?? part.quantity;
                const hasStockUpdate = stockUpdates[part.id] !== undefined;
                const status = getStockStatus(part.quantity, part.min_threshold);
                
                return (
                  <TableRow key={part.id}>
                    <TableCell className="font-medium">{part.part_name}</TableCell>
                    <TableCell>{part.part_number || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStockChange(part.id, -1)}
                          disabled={currentStock <= 0}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          type="number"
                          value={currentStock}
                          onChange={(e) => setStockUpdates(prev => ({ 
                            ...prev, 
                            [part.id]: parseInt(e.target.value) || 0 
                          }))}
                          className="w-20 text-center"
                          min="0"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStockChange(part.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        {hasStockUpdate && (
                          <Button
                            size="sm"
                            onClick={() => handleStockUpdate(part.id)}
                            className="ml-2"
                          >
                            Update
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{part.min_threshold}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>{part.supplier_name || '-'}</TableCell>
                    <TableCell>{part.supplier_contact || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEditPart(part)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDeletePart(part.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {parts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No parts found. Add your first part to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};