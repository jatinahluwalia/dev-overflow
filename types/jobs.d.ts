export interface ApplyOption {
  apply_link: string;
  is_direct: boolean;
  publisher: string;
}

export interface JobHighlights {
  Benefits?: string[];
  Qualifications?: string[];
  Responsibilities?: string[];
}

export interface JobRequiredEducation {
  associates_degree: boolean;
  bachelors_degree: boolean;
  degree_mentioned: boolean;
  degree_preferred: boolean;
  high_school: boolean;
  postgraduate_degree: boolean;
  professional_certification: boolean;
  professional_certification_mentioned: boolean;
}

export interface JobRequiredExperience {
  experience_mentioned: boolean;
  experience_preferred: boolean;
  no_experience_required: boolean;
  required_experience_in_months: number | null;
}

export interface Parameters {
  num_pages: number;
  page: number;
  query: string;
}

export interface Datum {
  apply_options: ApplyOption[];
  employer_company_type: null | string;
  employer_logo: null | string;
  employer_name: string;
  employer_website: null | string;
  job_apply_is_direct: boolean;
  job_apply_link: string;
  job_apply_quality_score: number;
  job_benefits: null;
  job_city: null | string;
  job_country: string;
  job_description: string;
  job_employment_type: string;
  job_experience_in_place_of_education: boolean;
  job_google_link: string;
  job_highlights: JobHighlights;
  job_id: string;
  job_is_remote: boolean;
  job_job_title: null | string;
  job_latitude: number;
  job_longitude: number;
  job_max_salary: number | null;
  job_min_salary: number | null;
  job_naics_code?: string;
  job_naics_name?: string;
  job_occupational_categories?: string[];
  job_offer_expiration_datetime_utc: Date | null;
  job_offer_expiration_timestamp: number | null;
  job_onet_job_zone: string;
  job_onet_soc: string;
  job_posted_at_datetime_utc: Date;
  job_posted_at_timestamp: number;
  job_posting_language: string;
  job_publisher: string;
  job_required_education: JobRequiredEducation;
  job_required_experience: JobRequiredExperience;
  job_required_skills: string[] | null;
  job_salary_currency: null | string;
  job_salary_period: null | string;
  job_state: null | string;
  job_title: string;
}

export interface RootObject {
  data: Datum[];
  parameters: Parameters;
  request_id: string;
  status: string;
}
