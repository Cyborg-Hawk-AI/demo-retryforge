import { ToastProvider } from "@/components/Toast";
import DemoDashboard from "@/components/demo/DemoDashboard";

export const metadata = {
  title: "Live Demo — RetryForge",
  description: "Interactive demo of RetryForge's retry and recovery dashboard for n8n, Make, and Zapier.",
};

export default function DemoPage() {
  return (
    <ToastProvider>
      <DemoDashboard />
    </ToastProvider>
  );
}
