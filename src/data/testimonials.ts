export interface Testimonial {
  quote:   string;
  author:  string;
  role:    string;          // np. „Właścicielka, Studio XYZ”
  project?: string;         // slug projektu z talii, jeśli dotyczy
  url?:     string;         // link do źródła opinii (np. Google, LinkedIn)
}

/**
 * Opinie klientów. Dodawaj tylko prawdziwe, za zgodą autora.
 * Pusta lista = sekcja się nie wyświetla.
 *
 * Przykład:
 * {
 *   quote:  'Treść opinii…',
 *   author: 'Imię Nazwisko',
 *   role:   'Stanowisko, Firma',
 *   url:    'https://…',
 * },
 */
export const testimonials: Testimonial[] = [];
