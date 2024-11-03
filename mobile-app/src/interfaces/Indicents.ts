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
}

export interface Contact {
  phone: string;
}


