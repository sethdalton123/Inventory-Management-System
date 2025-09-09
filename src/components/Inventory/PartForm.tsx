import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Part } from '@/hooks/useInventory';

interface PartFormProps {
  part?: Part | null;
  onSubmit: (partData: Omit<Part, 'id' | 'last_updated'>) => void;
  onCancel: () => void;
}

export const PartForm = ({ part, onSubmit, onCancel }: PartFormProps) => {
  const [formData, setFormData] = useState({
    part_name: '',
    part_number: '',
    quantity: 0,
    min_threshold: 5,
    supplier_name: '',
    supplier_contact: ''
  });

  useEffect(() => {
    if (part) {
      setFormData({
        part_name: part.part_name,
        part_number: part.part_number || '',
        quantity: part.quantity,
        min_threshold: part.min_threshold,
        supplier_name: part.supplier_name || '',
        supplier_contact: part.supplier_contact || ''
      });
    } else {
      setFormData({
        part_name: '',
        part_number: '',
        quantity: 0,
        min_threshold: 5,
        supplier_name: '',
        supplier_contact: ''
      });
    }
  }, [part]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      part_number: formData.part_number || null,
      supplier_name: formData.supplier_name || null,
      supplier_contact: formData.supplier_contact || null
    });
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{part ? 'Edit Part' : 'Add New Part'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="part_name">Part Name *</Label>
              <Input
                id="part_name"
                value={formData.part_name}
                onChange={(e) => handleChange('part_name', e.target.value)}
                required
                placeholder="e.g., Brake Pads - Front"
              />
            </div>
            
            <div>
              <Label htmlFor="part_number">Part Number</Label>
              <Input
                id="part_number"
                value={formData.part_number}
                onChange={(e) => handleChange('part_number', e.target.value)}
                placeholder="e.g., BP-001"
              />
            </div>
            
            <div>
              <Label htmlFor="quantity">Current Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="min_threshold">Minimum Threshold *</Label>
              <Input
                id="min_threshold"
                type="number"
                min="1"
                value={formData.min_threshold}
                onChange={(e) => handleChange('min_threshold', parseInt(e.target.value) || 1)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="supplier_name">Supplier Name</Label>
              <Input
                id="supplier_name"
                value={formData.supplier_name}
                onChange={(e) => handleChange('supplier_name', e.target.value)}
                placeholder="e.g., AutoParts Express"
              />
            </div>
            
            <div>
              <Label htmlFor="supplier_contact">Supplier Contact</Label>
              <Input
                id="supplier_contact"
                value={formData.supplier_contact}
                onChange={(e) => handleChange('supplier_contact', e.target.value)}
                placeholder="e.g., +1-555-0101"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {part ? 'Update Part' : 'Add Part'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};