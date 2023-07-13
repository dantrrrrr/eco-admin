"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Server } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
// Define an interface named ApiAlertProps
// It represents the expected props for the ApiAlert component
interface ApiAlertProps {
  title: string; // The title of the ApiAlert component (expected to be a string)
  description: string; // The description of the ApiAlert component (expected to be a string)
  variant: "public" | "admin"; // The variant of the ApiAlert component (expected to be either "public" or "admin")
}

// Define a constant variable named textMap
// It is an object that maps values of ApiAlertProps["variant"] to string values
const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public ", // When ApiAlertProps["variant"] is "public", the corresponding string is "Public "
  admin: "Admin", // When ApiAlertProps["variant"] is "admin", the corresponding string is "Admin"
};

// Define a constant variable named variantMap
// It is an object that maps values of ApiAlertProps["variant"] to BadgeProps["variant"]
const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary", // When ApiAlertProps["variant"] is "public", the corresponding BadgeProps["variant"] is "secondary"
  admin: "destructive", // When ApiAlertProps["variant"] is "admin", the corresponding BadgeProps["variant"] is "destructive"
};

export const ApiAlert = ({
  title,
  description,
  variant = "public",
}: ApiAlertProps) => {
  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast.success("API copied successfully to clipboard.");
  };
  return (
    <Alert>
      <Server className="w-4 h-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ">
          {description}
        </code>
        <Button variant="outline" size="icon" onClick={onCopy}>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};
