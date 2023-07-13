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
import { Size } from "@prisma/client";
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
  value: z.string().min(1), // Validate that the image
});
// Define props interface
interface SizeFormProps {
  initialData: Size | null;
}

type SizeFormValues = z.infer<typeof formSchema>; // Infer the type of form values based on the schema

// SizeForm component
export const SizeForm = ({ initialData }: SizeFormProps) => {
  const [open, setOpen] = useState(false); // State for managing the visibility of the AlertModal component
  const [loading, setLoading] = useState(false); // State for tracking the loading state
  const title = initialData ? "Edit Size " : "Create Size";
  const description = initialData
    ? "Edit a Size "
    : "Add a new  Size";
  const toastMessage = initialData ? "Size updated" : "Size created";
  const action = initialData ? "Save changes " : "Create";

  const params = useParams(); // Get the current route parameters
  const router = useRouter(); // Router object for navigation

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema), // Use Zod resolver for form validation
    defaultValues: initialData || {
      name: "",
      value: "",
    }, // Set the initial form values based on the provided initialData prop
  });

  // Function for handling form submission
  const onSubmit = async (data: SizeFormValues) => {
    try {
      setLoading(true); // Set loading state to true to indicate that the form submission is in progress
      if (initialData) {
        // Make a post request to update the billboard's information
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes/`, data);
      }

      router.refresh(); // Refresh the router to reflect the changes
      router.push(`/${params.storeId}/sizes`);
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
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);

      router.refresh(); // Refresh the router to reflect the changes
      router.push(`/${params.storeId}/sizes`);
      toast.success("Size deleted successfully"); // Show a success toast message
    } catch (error) {
      toast.error("Make sure you removed all product using this size"); // Show an error toast message
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
                      placeholder="Size name"
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
                    <Input
                      disabled={loading}
                      placeholder="Size value"
                      {...field}
                    />
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
