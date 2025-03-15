import MedusaClient from "@medusajs/medusa-js";

export const medusa = new MedusaClient({
    baseUrl: "http://localhost:9000",
    maxRetries: 3,
    publishableApiKey: process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY,
  });