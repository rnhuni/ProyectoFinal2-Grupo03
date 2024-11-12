import { DocumentPickerResponse } from "react-native-document-picker";

export interface Incident {
  id?: string;
  description: string;
  type: string;
  created_at?: string;
  updated_at?: string;
  user_issuer_name?: string;
  contact: Contact;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  content_type: string;
  file_name: string;
  file_uri: string;
  fileObject?: DocumentPickerResponse;
}


export interface Contact {
  phone: string;
}

export interface IncidentTableData {
  id: string;
  description: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  user_issuer_name: string;
  contact: Contact;
  attachments: Attachment[];
}
