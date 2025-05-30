
'use server';

import { extractMedicationDetails, type ExtractMedicationDetailsInput } from '@/ai/flows/extract-medication-details';
import type { MedicationReminder } from '@/lib/types';

export interface ProcessPrescriptionResult {
  success: boolean;
  medications?: MedicationReminder[];
  error?: string;
}

export async function processPrescriptionImage(imageDataUrl: string): Promise<ProcessPrescriptionResult> {
  if (!imageDataUrl || !imageDataUrl.startsWith('data:image')) {
    return { success: false, error: "Invalid image data URL." };
  }

  try {
    const input: ExtractMedicationDetailsInput = { prescriptionImage: imageDataUrl };
    const result = await extractMedicationDetails(input);

    if (result && result.medications) {
      const newReminders: MedicationReminder[] = result.medications.map((med, index) => ({
        id: `ai-${Date.now()}-${index}`,
        name: med.name,
        dosage: med.dosage,
        timings: med.timings,
        isGenerated: true,
      }));
      return { success: true, medications: newReminders };
    }
    return { success: false, error: "No medication details could be extracted." };
  } catch (error) {
    console.error("Error processing prescription:", error);
    if (error instanceof Error) {
      return { success: false, error: `Failed to process prescription image: ${error.message}` };
    }
    return { success: false, error: "An unknown error occurred while processing the prescription." };
  }
}
