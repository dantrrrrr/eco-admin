"use client";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
export const ToasterProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return <Toaster></Toaster>;
};
