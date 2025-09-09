import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Part } from "@/hooks/useInventory";

interface PartFormProps {
  part?: Part;
  onSave: (data: Omit<Part, "id" | "last_updated">, id?: number) => void;
  onCancel: () => void;
}

export const PartForm = ({ part, onSave, onCancel }: PartFormProps) => {
  const [formData, setFormData] = useState<Omit<Part, "id" | "last_updated">>({
    part_name: "",
    part_number: "",
    quantity: 0,
    min_threshold: 0,
    supplier_name: "",
    supplier_contact: "",
  });

  useEffect(() => {
    if (part) {
      setFormData({
        part_name: part.part_name,
        part_number: part.part_number,
        quantity: part.quantity,
        min_threshold: part.min_threshold,
        supplier_name: part.supplier_name,
        supplier_contact: part.supplier_contact,
      });
    }
  }, [part]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "min_threshold" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, part?.id); // Pass ID if editing
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="part_name"
        placeholder="Part Name"
        value={formData.part_name}
        onChange={handleChange}
        required
      />
      <Input
        name="part_number"
        placeholder="Part Number"
        value={formData.part_number}
        onChange={handleChange}
      />
      <Input
        type="number"
        name="quantity"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        required
      />
      <Input
        type="number"
        name="min_threshold"
        placeholder="Minimum Threshold"
        value={formData.min_threshold}
        onChange={handleChange}
        required
      />
      <Input
        name="supplier_name"
        placeholder="Supplier Name"
        value={formData.supplier_name}
        onChange={handleChange}
      />
      <Input
        name="supplier_contact"
        placeholder="Supplier Contact"
        value={formData.supplier_contact}
        onChange={handleChange}
      />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {part ? "Update Part" : "Add Part"}
        </Button>
      </div>
    </form>
  );
};
