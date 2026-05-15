export type WorkType = 'landing' | 'app' | 'ecommerce' | 'other';

export type CaseStudyContent = {
  brief: string;
  concept: string;
  stackDetails: { name: string; role: string }[];
  highlights: { label: string; value: string }[];
};

export type Work = {
  slug:        string;
  title:       string;
  year:        string;
  role:        string;
  description: string;
  stack:       string[];
  thumbnail:   string;
  liveUrl?:    string;
  featured:    boolean;
  caseStudy:   boolean;
  type:        WorkType;
  caseStudyContent?: CaseStudyContent;
};
