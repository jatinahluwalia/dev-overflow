"use client";

import { useTheme } from "@/context/ThemeProvider";
import { Toaster } from "sonner";

const Toast = () => {
  const { mode } = useTheme();
  return <Toaster richColors position="top-center" closeButton theme={mode} />;
};

export default Toast;
