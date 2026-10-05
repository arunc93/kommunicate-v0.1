export async function uploadAttachments(requestId: string, files: File[]): Promise<void> {
  for (const file of files) {
    const body = new FormData();
    body.append("file", file);
    const response = await fetch(`/api/requests/${requestId}/attachments`, {
      method: "POST",
      body,
    });
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(data?.error || `Could not attach ${file.name}.`);
    }
  }
}
