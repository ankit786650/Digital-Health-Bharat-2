// 'use server';

/**
 * @fileOverview Extracts medication details from a prescription image using OCR and NLP.
 *
 * - extractMedicationDetails - A function that takes a prescription image and returns extracted medication details.
 * - ExtractMedicationDetailsInput - The input type for the extractMedicationDetails function.
 * - ExtractMedicationDetailsOutput - The return type for the extractMedicationDetails function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractMedicationDetailsInputSchema = z.object({
  prescriptionImage: z
    .string()
    .describe(
      "A photo of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractMedicationDetailsInput = z.infer<typeof ExtractMedicationDetailsInputSchema>;

const ExtractMedicationDetailsOutputSchema = z.object({
  medications: z.array(
    z.object({
      name: z.string().describe('The full name of the medication, including brand or generic name if available (e.g., "Lipitor", "Atorvastatin 20mg"). Strive for the most complete and accurate medication name found.'),
      dosage: z.string().describe('The dosage of the medication (e.g., 10mg, 5ml, 1 tablet).'),
      timings: z.string().describe('The timings for taking the medication (e.g., once daily, twice daily, every 8 hours, before meals).'),
    })
  ).describe('An array of medications extracted from the prescription.'),
});
export type ExtractMedicationDetailsOutput = z.infer<typeof ExtractMedicationDetailsOutputSchema>;

export async function extractMedicationDetails(input: ExtractMedicationDetailsInput): Promise<ExtractMedicationDetailsOutput> {
  return extractMedicationDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractMedicationDetailsPrompt',
  input: {schema: ExtractMedicationDetailsInputSchema},
  output: {schema: ExtractMedicationDetailsOutputSchema},
  prompt: `You are an AI assistant specialized in accurately extracting medication details from prescription images. Your primary goal is to identify each medication, its dosage, and its timings.

When analyzing the prescription image:
1.  **Medication Name:** Focus meticulously on identifying the **full name of each medication**. This includes brand names (e.g., Lipitor) and generic names (e.g., Atorvastatin). Medication names are often clearly listed, sometimes followed by their strength or dosage form. Be careful to distinguish medication names from other text like clinic names, doctor's names, or general instructions.
2.  **Dosage:** Extract the dosage of the medication (e.g., 10mg, 5ml, 1 tablet).
3.  **Timings:** Determine the timings for taking the medication (e.g., once daily, twice daily, every 8 hours, before meals).

Return the extracted information in a structured JSON format as described in the output schema.

Prescription Image: {{media url=prescriptionImage}}
  `,
});

const extractMedicationDetailsFlow = ai.defineFlow(
  {
    name: 'extractMedicationDetailsFlow',
    inputSchema: ExtractMedicationDetailsInputSchema,
    outputSchema: ExtractMedicationDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
