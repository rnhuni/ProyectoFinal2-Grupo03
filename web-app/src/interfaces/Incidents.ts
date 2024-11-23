export interface Incident {
  id?: string;
  description: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  user_issuer_name?: string;
  contact: Contact;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  content_type: string;
  file_name: string;
  file_uri: string;
  fileObject?: File;
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
  user_issuer_id: string;
  contact: Contact;
  attachments: Attachment[];
  assigned_to_id?: string;
  assigned_to_name?: string;
  assigned_to_type?: string;
  closed_by_id?: string;
  closed_by_name?: string;
  closed_by_type?: string;
  date_resolution?: string;
  publication_channel_id?: string;
  resolution_time?: string;
  sla?: number;
  status?:string;
}