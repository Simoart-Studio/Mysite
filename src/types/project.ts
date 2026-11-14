export type ProjectStatus = 'Wdrożony' | 'W rozwoju' | 'Prototyp';
export type ProjectLabel  = 'projekt własny' | 'demo' | 'prototyp' | 'klient';

export interface ProjectImage {
  src:     string;
  width:   number;
  height:  number;
  alt?:    string;
  device?: 'desktop' | 'mobile';
}

export interface ProjectChallenge {
  title: string;
  body:  string;
}

export interface Project {
  slug:          string;
  name:          string;
  repoName:      string;
  isPrivate:     boolean;
  status:        ProjectStatus;
  labels:        ProjectLabel[];
  tagline:       string | null;
  kind:          string | null; // krótko: czym jest projekt (np. „Sklep internetowy”)
  stack:         string[];
  stackFull:     string[];
  languages:     { name: string; percent: number }[];
  forWho:        string | null;
  problem:       string | null;
  solution:      string | null;
  benefits:      string[];      // co zyskuje klient (język korzyści, nie technologii)
  scope:         string | null;
  effect:        string | null;
  challenge:     ProjectChallenge | null;
  limitations:   string[];
  readmeSummary: string | null;
  readmeFeatures: string[];
  repoUrl:       string | null;
  demoUrl:       string | null;
  embed:         boolean;
  thumbnail:     ProjectImage | null;
  screenshots:   ProjectImage[];
  createdAt:     string | null;
  lastCommitAt:  string | null;
  stars:         number | null;
  topics:        string[];
  missing:       string[];
}
