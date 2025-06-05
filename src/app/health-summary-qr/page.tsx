
"use client";

import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, QrCode as QrCodeIcon, ShieldAlert, Info, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const healthSummarySchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  age: z.coerce.number().int().positive("Age must be a positive number.").min(0).max(150).optional(),
  sex: z.enum(["Male", "Female", "Other"], {
    required_error: "Sex is required.",
  }).optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"], {
    required_error: "Blood group is required.",
  }).optional(),
  emergencyContact1Name: z.string().optional(),
  emergencyContact1Phone: z.string().optional(),
  emergencyContact2Name: z.string().optional(),
  emergencyContact2Phone: z.string().optional(),
});

type HealthSummaryFormValues = z.infer<typeof healthSummarySchema>;

function calculateAge(dateOfBirth?: Date): number | undefined {
  if (!dateOfBirth) return undefined;
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }
  return age;
}

function mapProfileGenderToQrSex(gender?: string): "Male" | "Female" | "Other" | undefined {
  if (!gender) return undefined;
  switch (gender.toLowerCase()) {
    case "male": return "Male";
    case "female": return "Female";
    case "other": return "Other";
    default: return undefined;
  }
}

function mapProfileBloodTypeToQrBloodGroup(bloodType?: string): "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "Unknown" | undefined {
  if (!bloodType) return undefined;
  switch (bloodType) {
    case "a_pos": return "A+";
    case "a_neg": return "A-";
    case "b_pos": return "B+";
    case "b_neg": return "B-";
    case "ab_pos": return "AB+";
    case "ab_neg": return "AB-";
    case "o_pos": return "O+";
    case "o_neg": return "O-";
    case "unknown": return "Unknown";
    default: return undefined;
  }
}

const defaultProfileData = {
  firstName: "Kishan",
  middleName: "",
  lastName: "Davis",
  dateOfBirth: new Date("1990-07-22"),
  gender: "male",
  bloodType: "o_pos",
  emergencyContact1Name: "Jane Doe",
  emergencyContact1Phone: "(555) 987-6543",
  emergencyContact2Name: "John Smith",
  emergencyContact2Phone: "(555) 111-2222",
};

export default function HealthSummaryQrPage() {
  const [qrData, setQrData] = useState<string | null>(null);
  const [initialQrError, setInitialQrError] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const constructedFullName = `${defaultProfileData.firstName}${defaultProfileData.middleName ? ` ${defaultProfileData.middleName}` : ""} ${defaultProfileData.lastName}`;
  const mappedSex = mapProfileGenderToQrSex(defaultProfileData.gender);
  const mappedBloodGroup = mapProfileBloodTypeToQrBloodGroup(defaultProfileData.bloodType);

  const form = useForm<HealthSummaryFormValues>({
    resolver: zodResolver(healthSummarySchema),
    defaultValues: {
      fullName: constructedFullName || "",
      age: undefined, 
      sex: mappedSex,
      bloodGroup: mappedBloodGroup,
      emergencyContact1Name: defaultProfileData.emergencyContact1Name || "",
      emergencyContact1Phone: defaultProfileData.emergencyContact1Phone || "",
      emergencyContact2Name: defaultProfileData.emergencyContact2Name || "",
      emergencyContact2Phone: defaultProfileData.emergencyContact2Phone || "",
    },
  });

  useEffect(() => {
    const clientCalculatedAge = calculateAge(defaultProfileData.dateOfBirth);
    if (clientCalculatedAge !== undefined) {
        form.setValue('age', clientCalculatedAge, { shouldValidate: true });
    }

    const currentFormValues = form.getValues();
    const validationResult = healthSummarySchema.safeParse(currentFormValues);

    if (validationResult.success) {
      const jsonData = JSON.stringify(validationResult.data);
      setQrData(jsonData);
      setInitialQrError(null); 
    } else {
      setQrData(null);
      const errorMessages = Object.values(validationResult.error.flatten().fieldErrors)
        .flat()
        .filter(Boolean) as string[];
      setInitialQrError(errorMessages.length > 0 ? `Could not auto-generate QR: ${errorMessages.join(', ')}` : "Could not auto-generate QR due to invalid pre-filled data. Please check the form.");
      console.warn("Initial profile data for QR code (client-side hydration) is not valid:", validationResult.error.flatten().fieldErrors);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  function onSubmit(data: HealthSummaryFormValues) {
    const jsonData = JSON.stringify(data);
    setQrData(jsonData);
    setInitialQrError(null); // Clear initial error on successful manual generation
    toast({
      title: "QR Code Generated",
      description: "Your health summary QR code is ready.",
    });
  }

  const handleDownload = () => {
    if (qrCanvasRef.current) {
      const canvas = qrCanvasRef.current.querySelector("canvas");
      if (canvas) {
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "health-summary-qr.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        toast({
          title: "QR Code Downloaded",
          description: "health-summary-qr.png has been saved.",
        });
      } else {
        toast({
          title: "Download Failed",
          description: "Could not find the QR code canvas element.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <QrCodeIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">Health Summary QR Code</h1>
      </div>

      <Alert variant="default" className="bg-info-muted border-info text-info-muted-foreground">
        <Info className="h-5 w-5 text-info" />
        <AlertTitle className="font-medium text-info-muted-foreground">Important Note</AlertTitle>
        <AlertDescription className="text-info-muted-foreground/90">
          The information encoded in this QR code will be readable by anyone who scans it.
          Please ensure you are comfortable sharing this data before generating and using the QR code.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Your Health Information</CardTitle>
            <CardDescription>
              This information will be encoded into the QR code. Fields are pre-filled from your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input 
                            type="number" 
                            placeholder="e.g., 30" 
                            {...field} 
                            value={field.value ?? ''} 
                            onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sex</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""} defaultValue={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""} defaultValue={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact1Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact 1: Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact1Phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact 1: Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., (555) 987-6543" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact2Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact 2: Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Smith" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyContact2Phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact 2: Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="e.g., (555) 111-2222" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <QrCodeIcon className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Your QR Code</CardTitle>
            <CardDescription>
              Scan this code to view the health summary.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[200px]">
            {initialQrError && !qrData && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>QR Generation Failed</AlertTitle>
                <AlertDescription>
                  {initialQrError}
                </AlertDescription>
              </Alert>
            )}
            {qrData ? (
              <div ref={qrCanvasRef} className="p-4 bg-white rounded-md shadow-md inline-block">
                <QRCodeCanvas
                  value={qrData}
                  size={256}
                  bgColor={"#ffffff"}
                  fgColor={"#000000"}
                  level={"L"}
                  includeMargin={true}
                />
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <QrCodeIcon className="h-16 w-16 mx-auto mb-2" />
                <p>QR code will appear here after you generate it.</p>
                {!initialQrError && <p className="text-xs mt-1">If data is valid, it should appear on load. Otherwise, complete the form and click "Generate".</p>}
              </div>
            )}
          </CardContent>
          {qrData && (
            <CardFooter>
              <Button onClick={handleDownload} className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download QR Code (PNG)
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}

