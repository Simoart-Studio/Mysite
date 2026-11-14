export interface Testimonial {
  quote:   string;
  author:  string;
  role:    string;
  project?: string;
  url?:     string;
}

export const testimonials: Testimonial[] = [];
