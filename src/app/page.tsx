
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-4">
      <h1 className="text-4xl font-bold">Welcome to Your App!</h1>
      <p className="text-lg text-muted-foreground">
        This is a fresh start. Begin your redesign here.
      </p>
      <Button>Get Started</Button>
    </main>
  );
}
