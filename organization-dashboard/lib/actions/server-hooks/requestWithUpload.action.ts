"use server";

import { put } from "@vercel/blob";
import got from "got";

export async function getDocAndUpload(
  data: Record<string, string | undefined>,
  url: string,
  docName: string,
): Promise<string | undefined> {
  try {
    // Send the GET request with the JSON data
    const response = await got.get(url, {
      responseType: "buffer", // Set response type to buffer to handle binary data
      json: data, // Send JSON data in the request body
    });

    // Check if response status is OK (200)
    if (response.statusCode === 200) {
      // Upload the PDF to a cloud storage service
      const pdfFile = response.body;
      const blob = await put(docName, pdfFile, {
        access: "public",
      });
      console.log("PDF uploaded to cloud storage successfully.");

      return blob.url;
    } else {
      console.error("Error:", response.statusMessage);
    }
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}
