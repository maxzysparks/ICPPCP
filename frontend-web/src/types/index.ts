// ============================================
// User Types
// ============================================
export enum UserRole {
  PATIENT = 'patient',
  CAREGIVER = 'caregiver',
  PROVIDER = 'provider',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  mfaEnabled: boolean;
  profilePicture?: string;
  preferredLanguage: string;
  timezone?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Patient Types
// ============================================
export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export interface PatientPreferences {
  communicationMethod?: 'email' | 'sms' | 'phone';
  reminderFrequency?: 'daily' | 'weekly' | 'asNeeded';
  shareDataWithCaregivers?: boolean;
  shareDataWithProviders?: boolean;
}

export interface Patient {
  id: string;
  userId: string;
  user?: User;
  medicalRecordNumber?: string;
  bloodType?: BloodType;
  height?: string;
  weight?: string;
  allergies?: string;
  chronicConditions?: string;
  primaryPhysician?: string;
  primaryPhysicianPhone?: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceGroupNumber?: string;
  notes?: string;
  preferences?: PatientPreferences;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Medication Types
// ============================================
export enum MedicationStatus {
  ACTIVE = 'active',
  DISCONTINUED = 'discontinued',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
}

export enum MedicationFrequency {
  ONCE_DAILY = 'once_daily',
  TWICE_DAILY = 'twice_daily',
  THREE_TIMES_DAILY = 'three_times_daily',
  FOUR_TIMES_DAILY = 'four_times_daily',
  EVERY_OTHER_DAY = 'every_other_day',
  WEEKLY = 'weekly',
  AS_NEEDED = 'as_needed',
  CUSTOM = 'custom',
}

export enum MedicationRoute {
  ORAL = 'oral',
  TOPICAL = 'topical',
  INJECTION = 'injection',
  INHALATION = 'inhalation',
  RECTAL = 'rectal',
  OPHTHALMIC = 'ophthalmic',
  OTIC = 'otic',
  NASAL = 'nasal',
  OTHER = 'other',
}

export interface Medication {
  id: string;
  patientId: string;
  patient?: Patient;
  name: string;
  genericName?: string;
  rxNormCode?: string;
  dosage: string;
  strength?: string;
  route: MedicationRoute;
  frequency: MedicationFrequency;
  customFrequency?: string;
  scheduledTimes?: string[];
  startDate: string;
  endDate?: string;
  status: MedicationStatus;
  prescribedBy?: string;
  prescriptionNumber?: string;
  refillsRemaining?: number;
  pharmacy?: string;
  pharmacyPhone?: string;
  purpose?: string;
  sideEffects?: string;
  instructions?: string;
  notes?: string;
  reminderEnabled: boolean;
  reminderMinutesBefore: number;
  addedBy?: string;
  lastTakenAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Appointment Types
// ============================================
export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum AppointmentType {
  IN_PERSON = 'in_person',
  TELEHEALTH = 'telehealth',
  PHONE = 'phone',
  HOME_VISIT = 'home_visit',
}

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  providerId?: string;
  provider?: Provider;
  title: string;
  description?: string;
  scheduledDate: string;
  durationMinutes: number;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  location?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  virtualMeetingLink?: string;
  providerName?: string;
  specialty?: string;
  contactPhone?: string;
  purpose?: string;
  preparation?: string;
  notes?: string;
  outcome?: string;
  reminderEnabled: boolean;
  reminderMinutesBefore: number;
  reminderSentAt?: string;
  confirmedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Provider Types
// ============================================
export enum ProviderType {
  PHYSICIAN = 'physician',
  NURSE = 'nurse',
  NURSE_PRACTITIONER = 'nurse_practitioner',
  PHYSICIAN_ASSISTANT = 'physician_assistant',
  THERAPIST = 'therapist',
  PHARMACIST = 'pharmacist',
  SOCIAL_WORKER = 'social_worker',
  CASE_MANAGER = 'case_manager',
  OTHER = 'other',
}

export enum ProviderSpecialty {
  PRIMARY_CARE = 'primary_care',
  CARDIOLOGY = 'cardiology',
  ONCOLOGY = 'oncology',
  NEUROLOGY = 'neurology',
  ENDOCRINOLOGY = 'endocrinology',
  GERIATRICS = 'geriatrics',
  PSYCHIATRY = 'psychiatry',
  PHYSICAL_THERAPY = 'physical_therapy',
  OCCUPATIONAL_THERAPY = 'occupational_therapy',
  HOME_HEALTH = 'home_health',
  PALLIATIVE_CARE = 'palliative_care',
  OTHER = 'other',
}

export interface OfficeHours {
  monday?: { start: string; end: string };
  tuesday?: { start: string; end: string };
  wednesday?: { start: string; end: string };
  thursday?: { start: string; end: string };
  friday?: { start: string; end: string };
  saturday?: { start: string; end: string };
  sunday?: { start: string; end: string };
}

export interface Provider {
  id: string;
  userId: string;
  user?: User;
  providerType: ProviderType;
  specialty?: ProviderSpecialty;
  licenseNumber: string;
  licenseState: string;
  licenseExpiration?: string;
  npiNumber?: string;
  deaNumber?: string;
  organization: string;
  department?: string;
  officeAddress?: string;
  officeCity?: string;
  officeState?: string;
  officeZipCode?: string;
  officePhone?: string;
  officeFax?: string;
  credentials?: string;
  yearsOfExperience: number;
  bio?: string;
  acceptingNewPatients: boolean;
  languagesSpoken?: string[];
  officeHours?: OfficeHours;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Caregiver Types
// ============================================
export enum CaregiverType {
  FAMILY = 'family',
  PROFESSIONAL = 'professional',
  FRIEND = 'friend',
  VOLUNTEER = 'volunteer',
}

export enum RelationshipType {
  SPOUSE = 'spouse',
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  GRANDPARENT = 'grandparent',
  GRANDCHILD = 'grandchild',
  FRIEND = 'friend',
  PROFESSIONAL = 'professional',
  OTHER = 'other',
}

export interface Caregiver {
  id: string;
  userId: string;
  user?: User;
  caregiverType: CaregiverType;
  relationshipType?: RelationshipType;
  organization?: string;
  licenseNumber?: string;
  certification?: string;
  yearsOfExperience: number;
  specializations?: string;
  bio?: string;
  availableForNewPatients: boolean;
  availability?: OfficeHours;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Care Team Types
// ============================================
export enum CareTeamStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

export interface CareTeamSettings {
  allowMemberInvites?: boolean;
  requireApprovalForNewMembers?: boolean;
  allowDocumentSharing?: boolean;
  allowMessaging?: boolean;
  notifyOnNewActivity?: boolean;
}

export interface CareTeam {
  id: string;
  name: string;
  description?: string;
  patientId: string;
  patient?: Patient;
  status: CareTeamStatus;
  startDate?: string;
  endDate?: string;
  settings?: CareTeamSettings;
  members?: CareTeamMember[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Care Team Member Types
// ============================================
export enum MemberRole {
  PRIMARY_CAREGIVER = 'primary_caregiver',
  SECONDARY_CAREGIVER = 'secondary_caregiver',
  FAMILY_MEMBER = 'family_member',
  HEALTHCARE_PROVIDER = 'healthcare_provider',
  CASE_MANAGER = 'case_manager',
  OBSERVER = 'observer',
}

export enum MemberStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  INACTIVE = 'inactive',
  REMOVED = 'removed',
}

export enum PermissionLevel {
  FULL_ACCESS = 'full_access',
  EDIT = 'edit',
  VIEW_ONLY = 'view_only',
}

export interface MemberPermissions {
  canViewCarePlan?: boolean;
  canEditCarePlan?: boolean;
  canViewMedications?: boolean;
  canEditMedications?: boolean;
  canViewAppointments?: boolean;
  canEditAppointments?: boolean;
  canViewDocuments?: boolean;
  canUploadDocuments?: boolean;
  canSendMessages?: boolean;
  canInviteMembers?: boolean;
  canRemoveMembers?: boolean;
}

export interface CareTeamMember {
  id: string;
  careTeamId: string;
  careTeam?: CareTeam;
  userId: string;
  user?: User;
  role: MemberRole;
  status: MemberStatus;
  permissionLevel: PermissionLevel;
  joinedAt?: string;
  invitedAt?: string;
  invitedBy?: string;
  lastAccessedAt?: string;
  permissions?: MemberPermissions;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Auth Types
// ============================================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role?: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// ============================================
// API Response Types
// ============================================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

// ============================================
// Query Types
// ============================================
export interface BaseQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}

export interface PatientQuery extends BaseQuery {
  bloodType?: BloodType;
  insuranceProvider?: string;
}

export interface MedicationQuery extends BaseQuery {
  patientId?: string;
  status?: MedicationStatus;
  frequency?: MedicationFrequency;
}

export interface AppointmentQuery extends BaseQuery {
  patientId?: string;
  providerId?: string;
  status?: AppointmentStatus;
  appointmentType?: AppointmentType;
  startDate?: string;
  endDate?: string;
}

export interface ProviderQuery extends BaseQuery {
  providerType?: ProviderType;
  specialty?: ProviderSpecialty;
  acceptingNewPatients?: boolean;
}

export interface CaregiverQuery extends BaseQuery {
  caregiverType?: CaregiverType;
  availableForNewPatients?: boolean;
}

export interface CareTeamQuery extends BaseQuery {
  patientId?: string;
  status?: CareTeamStatus;
}
