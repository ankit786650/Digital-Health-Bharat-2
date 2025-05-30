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
      name: z.string().describe('The name of the medication.'),
      dosage: z.string().describe('The dosage of the medication (e.g., 10mg, 5ml).'),
      timings: z.string().describe('The timings for taking the medication (e.g., once daily, twice daily, every 8 hours).'),
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
  prompt: `You are an AI assistant specialized in extracting medication details from prescription images.

  Analyze the provided prescription image and extract the following information for each medication:
  - Name: The name of the medication.
  - Dosage: The dosage of the medication (e.g., 10mg, 5ml).
  - Timings: The timings for taking the medication (e.g., once daily, twice daily, every 8 hours).

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
