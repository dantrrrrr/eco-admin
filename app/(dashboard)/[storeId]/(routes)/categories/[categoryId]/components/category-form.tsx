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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { fi } from "date-fns/locale";
import { Files, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

// Define form validation schema using Zod
const formSchema = z.object({
  name: z.string().min(1), // Validate that the name field is a string and has a minimum length of 1
  billboardId: z.string().min(1), // Validate that the image
});
// Define props interface
interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

type CategoryFormValues = z.infer<typeof formSchema>; // Infer the type of form values based on the schema

// BillboardForm component
export const CategoryForm = ({
  initialData,
  billboards,
}: CategoryFormProps) => {
  const [open, setOpen] = useState(false); // State for managing the visibility of the AlertModal component
  const [loading, setLoading] = useState(false); // State for tracking the loading state

  const title = initialData ? "Edit category " : "Create category";
  const description = initialData ? "Edit a category " : "Add a new  category";
  const toastMessage = initialData ? "category updated" : "category created";
  const action = initialData ? "Save changes " : "Create";

  const params = useParams(); // Get the current route parameters
  const router = useRouter(); // Router object for navigation

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema), // Use Zod resolver for form validation
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    }, // Set the initial form values based on the provided initialData prop
  });

  // Function for handling form submission
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true); // Set loading state to true to indicate that the form submission is in progress
      if (initialData) {
        // Make a post request to update the billboard's information
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories/`, data);
      }

      router.refresh(); // Refresh the router to reflect the changes
      router.push(`/${params.storeId}/categories`);
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
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`
      );

      router.refresh(); // Refresh the router to reflect the changes
      router.push(`/${params.storeId}/categories`);
      toast.success("Category deleted successfully"); // Show a success toast message
    } catch (error) {
      toast.error("Make sure you removed all  product using this billboard."); // Show an error toast message
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
                      placeholder="Category name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>

                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
