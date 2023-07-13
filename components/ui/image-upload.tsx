"use client";

import { useEffect, useState } from "react";
import { ImagePlusIcon, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
}
const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const onUpload = (result: any) => {
    //get url from cloud provider save to
    onChange(result.info.secure_url); //url
    console.log("IMAGE_UPLOAD", result);
  };

  if (!mounted) return null;

  return (
    <div className="">
      <div className="mb-4 flex items-center gap-4 ">
        {value.map((url) => (
          <div
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
            key={url}
          >
            <div className="z-10 absolute top-2 right-2">
              {/* delete button top right corner */}

              <Button
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash />
              </Button>
            </div>
            <Image
              fill
              src={url}
              className="object-cover"
              alt="image uploader"
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="rqbncuyh">
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlusIcon className="w-4 h-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};
export default ImageUpload;
