export type FamilyMember = {
  id: string;
  fullName: string;
  role: string;
  work: string;
  /** ISO date string: YYYY-MM-DD */
  dateOfBirth: string;
  /** Path under /public */
  photoSrc: string;
  /** Optional gallery images (paths under /public). */
  gallerySrcs?: string[];
};

export type Relationship =
  | { type: "spouse"; from: string; to: string }
  | { type: "parent"; from: string; to: string };

export const familyData = {
  familyName: "Akhter's Family",
  members: [
    {
      id: "akhter-hossain",
      fullName: "Akhter Hossain",
      role: "Dad",
      work: "Chairman of Matribbhumi Model School and College",
      dateOfBirth: "1973-02-01",
      photoSrc: "/images/family/akhter.jpeg",
    },
    {
      id: "farhana-akter-rumi",
      fullName: "Farhana Akter Rumi",
      role: "Mom",
      work: "Housewife; ex Bangla teacher of NIM",
      dateOfBirth: "1979-05-05",
      photoSrc: "/images/family/rumi.jpeg",
    },
    {
      id: "rahikul-makhtum-abir",
      fullName: "Rahikul Makhtum Abir",
      role: "Eldest Son (1st child)",
      work: "Web developer; creator of the website",
      dateOfBirth: "2006-04-14",
      photoSrc: "/images/family/abir.jpeg",
    },
    {
      id: "tahniya-anika-oishi",
      fullName: "Tahniya Anika Oishi",
      role: "Middle Child (2nd child)",
      work: "Student (Class 10)",
      dateOfBirth: "2010-08-18",
      photoSrc: "/images/family/oishi.jpeg",
    },
    {
      id: "afifa-binte-akter",
      fullName: "Afifa Binte Akter",
      role: "Youngest Child (last child)",
      work: "Student (Class 9)",
      dateOfBirth: "2012-01-11",
      photoSrc: "/images/family/afifa.jpeg",
    },
  ] satisfies FamilyMember[],
  relationships: [
    { type: "spouse", from: "akhter-hossain", to: "farhana-akter-rumi" },
    { type: "parent", from: "akhter-hossain", to: "rahikul-makhtum-abir" },
    { type: "parent", from: "farhana-akter-rumi", to: "rahikul-makhtum-abir" },
    { type: "parent", from: "akhter-hossain", to: "tahniya-anika-oishi" },
    { type: "parent", from: "farhana-akter-rumi", to: "tahniya-anika-oishi" },
    { type: "parent", from: "akhter-hossain", to: "afifa-binte-akter" },
    { type: "parent", from: "farhana-akter-rumi", to: "afifa-binte-akter" },
  ] satisfies Relationship[],
} as const;
