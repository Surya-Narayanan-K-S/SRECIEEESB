/**
 * IEEE Student Branch SREC - Core System & Ecosystem Configuration
 * Maintained by IEEE SREC Student Branch Core Web & IT Development Team
 * Institution: Sri Ramakrishna Engineering College (SREC), Coimbatore
 * Branch Code: STB32131 / School Code: STB64071
 */

export const SITE_METADATA = {
  name: "IEEE Student Branch SREC Web Portal",
  shortName: "IEEE SREC",
  version: "2.0.0",
  architecture: "Single Page Application (SPA) / Micro-Portal Hub",
  institution: {
    name: "Sri Ramakrishna Engineering College",
    shortName: "SREC",
    location: "Vattamalaipalayam, NGGO Colony Post, Coimbatore - 641022, Tamil Nadu, India",
    affiliation: "Anna University, Chennai | Autonomous Institution",
    accreditation: "NAAC 'A+' Grade | NBA Accredited",
    website: "https://srec.ac.in",
  },
  branch: {
    section: "IEEE Madras Section",
    region: "Region 10 (Asia-Pacific)",
    code: "STB32131",
    schoolCode: "STB64071",
    establishedYear: 2001,
    officialEmail: "ieee@srec.ac.in",
  },
  leadDeveloper: {
    name: "Surya Narayanan K S",
    role: "Lead Systems Architect & Core Webmaster",
    department: "Information Technology",
    institution: "Sri Ramakrishna Engineering College",
    github: "https://github.com/Surya-Narayanan-K-S",
  },
  technicalTeam: [
    {
      team: "IEEE SREC Core Web & IT Operations",
      responsibilities: ["Frontend Architecture", "Database & Auth", "Forex Engine", "Telemetry & Security"],
    },
  ],
  endpoints: {
    currencyApi: "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
    currencyApiFallback: "https://latest.currency-api.pages.dev/v1/currencies/usd.json",
    telemetryGeoIp: "https://ipwho.is/",
  },
  fees: {
    branchProcessingChargeINR: 200,
    gstRatePercent: 18,
    defaultUsdRate: 87.5,
  },
};

export const TECHNICAL_SOCIETIES = [
  { id: "cs", code: "CS", name: "IEEE Computer Society", slug: "cs" },
  { id: "pels", code: "PELS", name: "IEEE Power Electronics Society", slug: "pels" },
  { id: "wie", code: "WIE", name: "IEEE Women in Engineering", slug: "wie" },
  { id: "cis", code: "CIS", name: "IEEE Computational Intelligence Society", slug: "cis" },
  { id: "comsoc", code: "ComSoc", name: "IEEE Communications Society", slug: "comsoc" },
  { id: "embs", code: "EMBS", name: "IEEE Engineering in Medicine and Biology Society", slug: "embs" },
  { id: "im", code: "IMS", name: "IEEE Instrumentation and Measurement Society", slug: "im" },
  { id: "cas", code: "CASS", name: "IEEE Circuits and Systems Society", slug: "cas" },
];
