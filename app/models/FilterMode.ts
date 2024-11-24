export interface SkillProps {
  description?: string;
  isDeleted?: boolean;
  _id?: string;
  name?: string;
  value?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LanguageProps {
  isDeleted?: boolean;
  _id?: string;
  name?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatDataProps {
  isDeleted?: boolean;
  message?: string;
  image?: string;
  isRead?: boolean;
  _id?: string;
  receiverId?: string;
  senderId?: string;
  appointmentId?: string;
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: string;
}
