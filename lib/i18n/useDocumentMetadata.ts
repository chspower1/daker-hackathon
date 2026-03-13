"use client";

import { useEffect } from "react";

export function useDocumentMetadata(metadata: {
  title: string;
  description: string;
}) {
  useEffect(() => {
    document.title = metadata.title;

    const metaDescription = document.querySelector('meta[name="description"]');

    if (metaDescription !== null) {
      metaDescription.setAttribute("content", metadata.description);
    }
  }, [metadata.description, metadata.title]);
}
