
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSaveSettings = () => {
    // Placeholder for actual save logic
    toast({
      title: "Settings Saved",
      description: "Your settings have been successfully updated.",
    });
  };
  
  const handleUpdateProfile = () => {
    toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
    });
  };

  const handleChangePassword = () => {
    // Placeholder for change password flow
    toast({
        title: "Change Password Clicked",
        description: "This would typically open a modal or navigate to a password change form.",
    });
  };


  return (
    <div className="flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </header>

      <section className="mb-10">
        <h2 className="mb-6 border-b border-border pb-2 text-xl font-semibold text-foreground">
          Profile
        </h2>
        <div className="grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="name" className="mb-1 block text-sm font-medium text-muted-foreground">Name</Label>
            <Input id="name" placeholder="Dr. Emily Carter" defaultValue="Dr. Emily Carter" className="form-input py-3 px-4" />
          </div>
          <div>
            <Label htmlFor="email" className="mb-1 block text-sm font-medium text-muted-foreground">Email</Label>
            <Input id="email" type="email" placeholder="emily.carter@example.com" defaultValue="emily.carter@example.com" className="form-input py-3 px-4" />
          </div>
          <div>
            <Label htmlFor="phone" className="mb-1 block text-sm font-medium text-muted-foreground">Phone</Label>
            <Input id="phone" type="tel" placeholder="(555) 123-4567" defaultValue="(555) 123-4567" className="form-input py-3 px-4" />
          </div>
          <div>
            <Label htmlFor="specialty" className="mb-1 block text-sm font-medium text-muted-foreground">Specialty</Label>
            <Input id="specialty" placeholder="Cardiology" defaultValue="Cardiology" className="form-input py-3 px-4" />
          </div>
        </div>
        <div className="mt-6">
          <Button onClick={handleUpdateProfile} className="h-10 px-5 text-sm font-semibold">
            Update Profile
          </Button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-6 border-b border-border pb-2 text-xl font-semibold text-foreground">
          Notifications
        </h2>
        <div className="max-w-3xl space-y-5">
          <Card>
            <CardContent className="flex items-start justify-between p-4">
              <div>
                <p className="text-base font-medium text-foreground">Email Notifications</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Receive email notifications for new patient requests, medication orders, and other important updates.
                </p>
              </div>
              <Switch defaultChecked id="email-notifications" aria-label="Email notifications toggle"/>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start justify-between p-4">
              <div>
                <p className="text-base font-medium text-foreground">In-App Notifications</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get in-app notifications for urgent alerts, reminders, and system messages.
                </p>
              </div>
              <Switch id="in-app-notifications" aria-label="In-app notifications toggle"/>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-6 border-b border-border pb-2 text-xl font-semibold text-foreground">
          Security
        </h2>
        <Card className="max-w-3xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-base text-foreground">Change Password</p>
              <Button onClick={handleChangePassword} variant="outline" size="sm" className="h-9 px-4 text-sm font-medium">
                Change
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Last changed: 3 months ago</p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <h2 className="mb-6 border-b border-border pb-2 text-xl font-semibold text-foreground">
          App Settings
        </h2>
        <div className="max-w-3xl space-y-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-base text-foreground">Language</p>
                <div className="flex items-center gap-2">
                  <p className="text-base text-muted-foreground">English</p>
                  <Button variant="link" size="sm" className="text-sm font-medium text-primary hover:text-primary/80">Change</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-base text-foreground">Theme</p>
                <div className="flex items-center gap-2">
                  <p className="text-base text-muted-foreground">Light</p>
                  <Button variant="link" size="sm" className="text-sm font-medium text-primary hover:text-primary/80">Change</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <Separator className="my-6"/>

      <div>
        <Button onClick={handleSaveSettings} className="h-10 px-5 text-sm font-semibold">
          Save All Settings
        </Button>
      </div>
    </div>
  );
}
