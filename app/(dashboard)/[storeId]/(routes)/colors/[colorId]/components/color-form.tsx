"use client";

// Import required components and libraries
import { AlertModal } from "@/components/alert-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

// Define form validation schema using Zod
const formSchema = z.object({
  name: z.string().min(1), // Validate that the name field is a string and has a minimum length of 1
  value: z.string().min(1).regex(/^#/, {
    message: "String must be a valid hex code",
  }), // Validate that the image
});
// Define props interface
interface ColorFormProps {
  initialData: Color | null;
}

type ColorFormValues = z.infer<typeof formSchema>; // Infer the type of form values based on the schema

// ColorForm component
export const ColorForm = ({ initialData }: ColorFormProps) => {
  const [open, setOpen] = useState(false); // State for managing the visibility of the AlertModal component
  const [loading, setLoading] = useState(false); // State for tracking the loading state
  const title = initialData ? "Edit color " : "Create color";
  const description = initialData ? "Edit a Color " : "Add a new  Color";
  const toastMessage = initialData ? "Color updated" : "Color created";
  const action = initialData ? "Save changes " : "Create";

  const params = useParams(); // Get the current route parameters
  const router = useRouter(); // Router object for navigation

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema), // Use Zod resolver for form validation
    defaultValues: initialData || {
      name: "",
      value: "",
    }, // Set the initial form values based on the provided initialData prop
  });

  // Function for handling form submission
  const onSubmit = async (data: ColorFormValues) => {
    try {
      setLoading(true); // Set loading state to true to indicate that the form submission is in progress
      if (initialData) {
        // Make a post request to update the billboard's information
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors/`, data);
      }

      router.refresh(); // Refresh the router to reflect the changes
      router.push(`/${params.storeId}/colors`);
      toast.success(toastMessage); // Show a success toast message
    } catch (error) {
      toast.error("Something went wrong!"); // Show an error toast message
    } finally {
      setLoading(false); // Set loading state to false to indicate that the form submission is complete
    }
  };

  // Function for handling store deletion
  const onDelete = async () => {
    try {
      setLoading(true); // Set loading state to true to indicate that the store deletion is in progress

      // Make a DELETE request to delete the store
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);

      router.refresh(); // Refresh the router to reflect the changes
      router.push(`/${params.storeId}/colors`);
      toast.success("Color deleted successfully"); // Show a success toast message
    } catch (error) {
      toast.error("Make sure you removed all product using this color"); // Show an error toast message
    } finally {
      setLoading(false); // Set loading state to false to indicate that the store deletion is complete
      setOpen(false); // Close the AlertModal component
    }
  };

  // Render the form component
  return (
    <>
      <AlertModal
        isOpen={open} // Set the visibility of the AlertModal component based on the 'open' state
        onClose={() => setOpen(false)} // Handle the close event of the AlertModal component
        onConfirm={onDelete} // Handle the confirm event of the AlertModal component
        loading={loading} // Pass the loading state to the AlertModal component
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => {
              setOpen(true); // Open the AlertModal component when the button is clicked
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color hex"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
