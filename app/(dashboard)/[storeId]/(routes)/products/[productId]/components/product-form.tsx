"use client";

// Import required components and libraries
import { AlertModal } from "@/components/alert-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import ImageUpload from "@/components/ui/image-upload";
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
import { Category, Color, Image, Product, Size } from "@prisma/client";
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
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

// Define props interface
interface ProductFormProps {
  initialData: (Product & { images: Image[] }) | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

type ProductFormValues = z.infer<typeof formSchema>; // Infer the type of form values based on the schema

// ProductForm component
export const ProductForm = ({
  initialData,
  categories,
  sizes,
  colors,
}: ProductFormProps) => {
  const [open, setOpen] = useState(false); // State for managing the visibility of the AlertModal component
  const [loading, setLoading] = useState(false); // State for tracking the loading state
  const title = initialData ? "Edit product " : "Create product";
  const description = initialData ? "Edit a product " : "Add a new  product";
  const toastMessage = initialData ? "product updated" : "product created";
  const action = initialData ? "Save changes " : "Create";

  const params = useParams(); // Get the current route parameters
  const router = useRouter(); // Router object for navigation

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema), // Use Zod resolver for form validation
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: false,
          isArchived: false,
        }, // Set the initial form values based on the provided initialData prop
  });

  // Function for handling form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true); // Set loading state to true to indicate that the form submission is in progress
      if (initialData) {
        // UPDATE
        await axios.patch(
          `/api/${params.storeId}/products/${params.productId}`,
          data
        );
      } else {
        //POST
        await axios.post(`/api/${params.storeId}/products/`, data);
      }

      router.refresh(); // Refresh the router to reflect the changes
      router.push(`/${params.storeId}/products`);
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
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);

      router.refresh(); // Refresh the router to reflect the changes
      router.push(`/${params.storeId}/products`);
      toast.success("Product deleted successfully"); // Show a success toast message
    } catch (error) {
      toast.error("Something went wrong ."); // Show an error toast message
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
          {" "}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    } // Xử lý sự kiện thay đổi giá trị của trường "imageUrl"
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                  {/* Khi sự kiện thay đổi xảy ra trong thành phần ImageUpload, hàm onChange của field được gọi với tham số là giá trị mới của trường "imageUrl". Điều này đồng nghĩa với việc giá trị của trường "imageUrl" sẽ được cập nhật với giá trị mới. */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      placeholder="Product Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.999"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>

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
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>

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
                          placeholder="Select a size"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>

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
                          placeholder="Select a color"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>
                          {color.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-5 space-y-0 rounded-md border p-4  ">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      //@ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on homepage
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-5 space-y-0 rounded-md border p-4  ">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      //@ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear on anywhere in store
                    </FormDescription>
                  </div>
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
