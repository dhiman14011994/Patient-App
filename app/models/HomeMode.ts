import {UserList} from './UserMode';
import {LanguageProps} from './FilterMode';

export interface PartnerList {
  socialMediaLinks?: socialMediaLinks;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  speciality?: SpecialityProps[];
  dob?: string;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  otp?: string;
  otpVerified?: boolean;
  otpExipredAt?: string;
  isDeleted?: boolean;
  isActive?: boolean;
  fcmToken?: string;
  _id?: string;
  isProfileUpdate?: boolean;
  mobileNumber?: any;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  role?: string;
  isOnline?: boolean;
  isVerified?: boolean;
  isLogin?: boolean;
  accessToken?: string;
  wage?: number;
  bio?: string;
  experience?: number;
  expertise?: expertiseProps[];
  documents?: string[];
  language?: LanguageProps[];
  coverImage?: string[];
  averageRating?: number;
  total_order?: number;
  __v?: string;
  wageForChat?: number;
  wageForCall?: number;
}

export interface expertiseProps {
  name?: string;
  value?: string;
}

// export interface LanguageProps {
//   name?: string;
//   value?: string;
// }

export interface SpecialityProps {
  cat?: string;
  key?: string;
}

export interface socialMediaLinks {
  google?: SocialProps;
}
export interface SocialProps {
  id?: any;
  profilePic?: any;
  displayName?: any;
  email?: any;
  isDeleted?: boolean;
}

export interface CategoriesProps {
  name?: string;
  isDeleted?: boolean;
  description?: string;
  isActive?: boolean;
  image?: string;
  _id?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogProps {
  description?: string;
  isDeleted?: boolean;
  isVerified?: boolean;
  _id?: string;
  title?: string;
  image?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface AppointmentProps {
  _id: string;
  isDeleted?: boolean;
  scheduledDateTime?: string;
  appointmentStatus?: string;
  createdBy?: string;
  scheduledBy?: string;
  scheduledWith?: string;
  createdAt?: string;
  scheduledBy_firstName?: string;
  scheduledBy_lasttName?: string;
  scheduledBy_email?: string;
  scheduledBy_mobileNumber?: string;
  scheduledWithPartner_firstName?: string;
  scheduledWithPartner_lastName?: string;
  scheduledWithPartner_email?: string;
  scheduledWithPartner_mobileNumber?: string;
  title?: string;
  appointmentType?: string;
  isExpireAppointment?: boolean;
  isValidForReqAcceptance?: boolean;
  lastUnReadMessageCreatedAt?: string;
  requestAcceptanceStatus?: boolean;
  scheduledBy_profilePicture?: string;
  scheduledWithPartner_isOnline?: boolean;
  scheduledWithPartner_profilePicture?: string;
  sessionStatus?: boolean;
  unReadMessages?: number;
  updatedAt?: string;
  waitingTime?: number;
}

export interface AppointmentListProps {
  allAppointments?: AppointmentProps[];
  waitListAppointments?: AppointmentProps[];
}

export interface SearchProps {
  _id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  profilePicture?: string;
  type?: string;
  description?: string;
  image: string;
}

export interface BannerProps {
  description?: string;
  isDeleted?: boolean;
  _id?: string;
  title?: string;
  image?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface TestimonialsProps {
  rating?: number;
  comment?: string;
  isDeleted?: boolean;
  _id?: string;
  partnerId?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface rattingAllProps {
  averageRating?: number;
  fiveStarRatings?: number;
  fourStarRatings?: number;
  threeStarRatings?: number;
  twoStarRatings?: number;
  oneStarRatings?: number;
  rating?: rattingProps[];
}

export interface rattingProps {
  rating?: number;
  comment?: string;
  isDeleted?: boolean;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v: 0;
  partner?: PartnerList;
  user?: UserList;
}
