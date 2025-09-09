import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useInventory, Part } from "@/hooks/useInventory";
import { PartsTable } from "@/components/Inventory/PartsTable";
import { PartForm } from "@/components/Inventory/PartForm";
import { useToast } from "@/hooks/use-toast";

const InventoryPage = () => {
  const { parts, addPart, updatePart, deletePart, updateStock } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const { toast } = useToast();

  // Unified save handler used by PartForm:
  // If `id` is provided we update; otherwise we add.
  const handleSave = async (partData: Omit<Part, "id" | "last_updated">, id?: number) => {
    try {
      if (typeof id === "number") {
        await updatePart(id, partData);
        toast({ title: "Success", description: "Part updated successfully!" });
      } else {
        await addPart(partData);
        toast({ title: "Success", description: "Part added successfully!" });
      }
      setIsModalOpen(false);
      setEditingPart(null);
    } catch (error) {
      toast({ title: "Error", description: "Failed to save part.", variant: "destructive" });
      throw error;
    }
  };

  const handleDeletePart = async (id: number) => {
    try {
      await deletePart(id);
      toast({ title: "Deleted", description: "Part removed successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete part.", variant: "destructive" });
    }
  };

  const handleUpdateStock = async (id: number, quantity: number) => {
    try {
      await updateStock(id, quantity);
      toast({ title: "Stock Updated", description: `Stock set to ${quantity}.` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update stock.", variant: "destructive" });
    }
  };

  const handleEditPart = (part: Part) => {
    setEditingPart(part);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>

        {/* Add/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPart(null);
                setIsModalOpen(true);
              }}
            >
              + Add New Part
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPart ? "Edit Part" : "Add New Part"}</DialogTitle>
            </DialogHeader>

            {/* PartForm is a plain form component (no internal Dialog) */}
            <PartForm
              part={editingPart ?? undefined}
              onSave={(data, id) => handleSave(data, id ?? editingPart?.id)}
              onCancel={() => {
                setEditingPart(null);
                setIsModalOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Parts Table */}
      <PartsTable
        parts={parts}
        onEditPart={handleEditPart}
        onDeletePart={handleDeletePart}
        onUpdateStock={handleUpdateStock}
      />
    </div>
  );
};

export default InventoryPage;
