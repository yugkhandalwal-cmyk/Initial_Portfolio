// Edit everything about your portfolio here.
export const CV_FILE = "/projects/Yug_Khandelwal.docx";
export const PHOTO = "/projects/photo.jpg";

export const profile = {
  name: "Yug Khandelwal",
  tagline: "B.Tech CSE Student | Full-Stack Developer",
  location: "Lovely Professional University, Kapurthala, Punjab",
  email: "yugkhandalwal@gmail.com",
  about:
    "I am a B.Tech Computer Science & Engineering student (9.16 CGPA) who builds scalable software for real-world problems. As a full-stack developer with 400+ problems solved on LeetCode and 100 on Codeforces, I combine strong data structures and algorithms with modern web development. I have led teams in hackathons and projects, and I enjoy turning ideas into production-ready products with clear communication and collaborative execution.",
};

export const links = [
  { label: "GitHub", url: "https://github.com/yugkhandalwal-cmyk" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/yug-khandelwal/" },
  { label: "X / Twitter", url: "https://x.com/Yug_khandelwalz" },
  { label: "LeetCode", url: "https://leetcode.com/u/Yugkhandelwal9636/" },
  { label: "Codeforces", url: "https://codeforces.com/profile/Yugkhandelwal_1_2" },
];

export const stats = [
  { value: "9.16", label: "CGPA" },
  { value: "400+", label: "LeetCode" },
  { value: "100", label: "Codeforces" },
];

export const skills = {
  Languages: ["C++", "C", "Python", "JavaScript"],
  "Web & Backend": ["HTML", "CSS", "React", "Node.js", "Express.js"],
  Database: ["PostgreSQL"],
  "Core & Tools": ["OOP", "Git", "GitHub", "Cloud Computing", "Networking"],
};

// Add more projects later: copy one object and edit it.
export const projects = [
  {
    title: "MumbaiToken (ERC-20)",
    description: "Custom ERC-20 token (DLT, 1M supply) built on OpenZeppelin and deployed on the Sepolia testnet using Remix. My first hands-on Web3 project.",
    stack: ["Solidity", "OpenZeppelin", "Remix", "Sepolia"],
    image: "/projects/web3.png",
    repo: "https://github.com/yugkhandalwal-cmyk/MumbaiToken-ERC20",
    live: "https://sepolia.etherscan.io/address/0x7d6ae3ab93a9cb01a2379b6e7bb1b7a42b16ab64",
  },
  {
    title: "Maintainer: Retail Business OS",
    description: "Retail business operating system for Indian SMB retailers, built from scratch.",
    stack: ["React", "Node.js", "PostgreSQL"],
    image: "",
    repo: "",
    live: "",
  },
  {
    title: "MumbaiFund (Crowdfunding)",
    description: "Crowdfunding smart contract with a 1 ETH goal and deadline. The owner withdraws if the goal is met, and contributors get refunds if it fails. Protected with ReentrancyGuard and deployed on Sepolia.",
    stack: ["Solidity", "OpenZeppelin", "Remix", "Sepolia"],
    image: "/projects/mumbaifund.jpg",
    repo: "https://github.com/yugkhandalwal-cmyk/MumbaiFund-Crowdfunding",
    live: "https://sepolia.etherscan.io/address/0xa37d8bf74096f0129a88728ba6c41935e552327b",
  },
];

export const education = {
  degree: "B.Tech, Computer Science & Engineering",
  school: "Lovely Professional University",
  detail: "CGPA 9.16 | DSA, OS, DBMS, Computer Networks",
};

export const achievements = [
  "400+ problems solved on LeetCode, 100 on Codeforces",
  "Hackathon participation with team leadership",
  "CGPA 9.16 at Lovely Professional University",
];

export const certificates = [
  { title: "C++ Programming Fundamentals", image: "/certs/certs1.jpg", url: "https://www.coursera.org/account/accomplishments/verify/47X813EMZK5N" },
  { title: "Programming for Everybody", image: "/certs/certs2.jpg", url: "https://www.coursera.org/account/accomplishments/verify/VSTP21ABKC0K" },
  { title: "GenAI for Everyone", image: "/certs/certs3.png", url: "https://www.coursera.org/account/accomplishments/verify/KY5HF8QESC4Y" },
  { title: "Computer Programming", image: "/certs/certs4.jpg", url: "https://kommodo.ai/i/zWv8zn4J4L5vhxwV6frg" },
];
