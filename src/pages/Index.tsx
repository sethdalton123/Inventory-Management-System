import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Header } from '@/components/Layout/Header';
import { StatsCards } from '@/components/Dashboard/StatsCards';
import { PartsTable } from '@/components/Inventory/PartsTable';
import { PartForm } from '@/components/Inventory/PartForm';
import { LowStockAlerts } from '@/components/Notifications/LowStockAlerts';
import { NotificationsList } from '@/components/Notifications/NotificationsList';
import { useInventory, Part } from '@/hooks/useInventory';

const Index = () => {
  const {
    parts,
    notifications,
    loading,
    addPart,
    updatePart,
    deletePart,
    updateStock,
    getLowStockParts,
    markNotificationAsRead
  } = useInventory();

  const [showForm, setShowForm] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleAddPart = async (partData: Omit<Part, 'id' | 'last_updated'>) => {
    try {
      await addPart(partData);
      setShowForm(false);
    } catch (error) {
      // Error already handled in the hook
    }
  };

  const handleEditPart = async (partData: Omit<Part, 'id' | 'last_updated'>) => {
    if (editingPart) {
      try {
        await updatePart(editingPart.id, partData);
        setEditingPart(null);
        setShowForm(false);
      } catch (error) {
        // Error already handled in the hook
      }
    }
  };

  const handleDeletePart = async (id: number) => {
    if (confirm('Are you sure you want to delete this part?')) {
      await deletePart(id);
    }
  };

  const startEditPart = (part: Part) => {
    setEditingPart(part);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingPart(null);
  };

  const lowStockCount = parts.filter(part => part.quantity <= part.min_threshold).length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        notificationCount={notifications.length} 
        onNotificationsClick={() => setShowNotifications(!showNotifications)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm ? (
          <PartForm
            part={editingPart}
            onSubmit={editingPart ? handleEditPart : handleAddPart}
            onCancel={cancelForm}
          />
        ) : (
          <>
            {/* Stats Cards */}
            <StatsCards parts={parts} lowStockCount={lowStockCount} />

            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Inventory Management</h2>
              <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add New Part</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main inventory table */}
              <div className="lg:col-span-2">
                <PartsTable
                  parts={parts}
                  onEditPart={startEditPart}
                  onDeletePart={handleDeletePart}
                  onUpdateStock={updateStock}
                />
              </div>

              {/* Sidebar with alerts and notifications */}
              <div className="space-y-6">
                <LowStockAlerts getLowStockParts={getLowStockParts} />
                
                {showNotifications && (
                  <NotificationsList
                    notifications={notifications}
                    onMarkAsRead={markNotificationAsRead}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
