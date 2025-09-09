import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Part {
  id: number;
  part_name: string;
  part_number: string | null;
  quantity: number;
  min_threshold: number;
  supplier_name: string | null;
  supplier_contact: string | null;
  last_updated: string | null;
}

export interface Notification {
  id: number;
  part_id: number | null;
  message: string;
  status: string | null;
  created_at: string | null;
}

export const useInventory = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchParts = async () => {
    try {
      const { data, error } = await supabase
        .from('parts')
        .select('*')
        .order('part_name');

      if (error) throw error;
      setParts(data || []);
    } catch (error) {
      console.error('Error fetching parts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch parts",
        variant: "destructive"
      });
    }
  };

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('status', 'unread')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const addPart = async (partData: Omit<Part, 'id' | 'last_updated'>) => {
    try {
      const { data, error } = await supabase
        .from('parts')
        .insert(partData)
        .select()
        .single();

      if (error) throw error;

      await fetchParts();
      await checkStockLevels();

      toast({
        title: "Success",
        description: "Part added successfully"
      });

      return data;
    } catch (error) {
      console.error('Error adding part:', error);
      toast({
        title: "Error",
        description: "Failed to add part",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updatePart = async (id: number, partData: Partial<Part>) => {
    try {
      const { error } = await supabase
        .from('parts')
        .update(partData)
        .eq('id', id);

      if (error) throw error;

      await fetchParts();
      await checkStockLevels();

      toast({
        title: "Success",
        description: "Part updated successfully"
      });
    } catch (error) {
      console.error('Error updating part:', error);
      toast({
        title: "Error",
        description: "Failed to update part",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deletePart = async (id: number) => {
    try {
      const { error } = await supabase
        .from('parts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchParts();
      await fetchNotifications();

      toast({
        title: "Success",
        description: "Part deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting part:', error);
      toast({
        title: "Error",
        description: "Failed to delete part",
        variant: "destructive"
      });
    }
  };

  const updateStock = async (id: number, quantity: number) => {
    try {
      if (quantity < 0) {
        toast({
          title: "Error",
          description: "Stock cannot be negative",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('parts')
        .update({ quantity })
        .eq('id', id);

      if (error) throw error;

      await fetchParts();
      await checkStockLevels();

      toast({
        title: "Success",
        description: "Stock updated successfully"
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive"
      });
    }
  };

  const checkStockLevels = async () => {
    try {
      const { error } = await supabase.rpc('check_stock_levels');
      if (error) throw error;
      await fetchNotifications();
    } catch (error) {
      console.error('Error checking stock levels:', error);
    }
  };

  const getLowStockParts = async () => {
    try {
      const { data, error } = await supabase.rpc('get_low_stock_parts');
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting low stock parts:', error);
      return [];
    }
  };

  const markNotificationAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', id);

      if (error) throw error;
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchParts(), fetchNotifications()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    parts,
    notifications,
    loading,
    addPart,
    updatePart,
    deletePart,
    updateStock,
    getLowStockParts,
    markNotificationAsRead,
    refreshData: () => Promise.all([fetchParts(), fetchNotifications()])
  };
};
