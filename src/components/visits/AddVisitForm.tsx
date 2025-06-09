import React, { useState } from "react";
import type { Visit } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface AddVisitFormProps {
  onAddVisit: (visit: Omit<Visit, 'id' | 'attachedDocuments'> & { attachedDocuments?: File[] }) => void;
  onCancel: () => void;
}

export function AddVisitForm({ onAddVisit, onCancel }: AddVisitFormProps) {
  const [date, setDate] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [notes, setNotes] = useState("");
  const [attachedDocuments, setAttachedDocuments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !doctorName) return;
    onAddVisit({ date, doctorName, specialization, notes, attachedDocuments });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-background p-4 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="input w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Doctor Name</label>
        <input type="text" value={doctorName} onChange={e => setDoctorName(e.target.value)} required className="input w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Specialization</label>
        <input type="text" value={specialization} onChange={e => setSpecialization(e.target.value)} className="input w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input w-full border rounded px-2 py-1" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Attach Documents</label>
        <input type="file" multiple onChange={e => setAttachedDocuments(Array.from(e.target.files || []))} />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Add Appointment</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
