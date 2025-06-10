export const CircleType = {
  IN_PERSON: "IN_PERSON",
  VIRTUAL: "VIRTUAL",
  HYBRID: "HYBRID",
} as const;

export type CircleType = (typeof CircleType)[keyof typeof CircleType];

export const EnrollmentStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  ATTENDED: "ATTENDED",
} as const;

export type EnrollmentStatus =
  (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

export interface UserSummary {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}
interface ResilienceCircleSummary {
  id: string;
  name: string;
  dateDescription: string;
  timeDescription: string;
}

export interface ResilienceCircleEnrollment {
  id: string;
  enrolledAt: string;
  status: EnrollmentStatus;
  user: UserSummary;
  circle: ResilienceCircleSummary;
}

export interface ResilienceCircle {
  id: string;
  name: string;
  location: string;
  address: string;
  dateDescription: string;
  timeDescription: string;
  type: CircleType;
  focus: string;
  facilitator: string;
  participants: number;
  maxParticipants: number;
  rating?: number | null;
  distance?: number | null;
  description: string;
  tags: string[];
  latitude?: number | null;
  longitude?: number | null;
  imageUrl?: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;

  enrolledUsers?: ResilienceCircleEnrollment[];
  confirmedParticipantsCount?: number;
}

export interface CreateResilienceCircleForm {
  name: string;
  location: string;
  address: string;
  dateDescription: string;
  timeDescription: string;
  type: CircleType;
  focus: string;
  facilitator: string;
  maxParticipants: number;
  description?: string;
  tags?: string[];
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  featured?: boolean;
}

export interface UpdateResilienceCircleForm {
  name?: string;
  location?: string;
  address?: string;
  dateDescription?: string;
  timeDescription?: string;
  type?: CircleType;
  focus?: string;
  facilitator?: string;
  maxParticipants?: number;
  rating?: number;
  description?: string;
  tags?: string[];
  latitude?: number;
  longitude?: number;
  imageUrl?: string;
  featured?: boolean;
}

export interface CreateEnrollmentPayload {
  status?: EnrollmentStatus;
}

export interface UpdateEnrollmentStatusPayload {
  status: EnrollmentStatus;
}
