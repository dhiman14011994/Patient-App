

export interface UserList {
  firstName?: string;
  lastName?: string;
  image?: string;
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
  mobile?: string;
  address?: string;
  userType?: string;
  socialMediaLinks?: socialMediaLinksProps;
  profilePicture?: string;
}

export interface socialMediaLinksProps {
  google?: socialProps;
}
export interface socialProps {
  id?: any;
  profilePic?: any;
  displayName?: any;
  email?: any;
  isDeleted?: boolean;
  isProfileUpdate?: boolean;
}
