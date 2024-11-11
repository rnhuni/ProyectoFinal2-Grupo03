import { Attachment } from "./Incidents";

export interface DownloadAttachmentProps {
  attachmentInfo: Attachment;
  incidentId: string;
}
