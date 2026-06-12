// Static site content (testimonials, FAQs, blog teasers, logos, icons).
// Product catalog now lives in MongoDB and is served by /api/products.

export const categories = [
  { name: 'Microsoft Office 2016', slug: 'microsoft-office-2016' },
  { name: 'Office', slug: 'office' },
  { name: 'Office For Mac', slug: 'office-for-macs' },
  { name: 'Microsoft Office', slug: 'microsoft-office' },
  { name: 'Microsoft Office 2024', slug: 'microsoft-office-2024' },
  { name: 'Office 2024 for Mac', slug: 'office-2024-for-mac' },
  { name: 'Microsoft Office 2021', slug: 'microsoft-office-2021' },
  { name: 'Office 2021 for Mac', slug: 'office-2021-for-mac' },
  { name: 'Office 2019 for Mac', slug: 'office-2019-for-mac' },
  { name: 'Office for Windows', slug: 'office-for-windows' },
  { name: 'Microsoft Office 2019', slug: 'microsoft-office-2019' },
  { name: 'Microsoft Project', slug: 'microsoft-project' },
  { name: 'Microsoft Apps', slug: 'microsoft-apps' },
  { name: 'Microsoft Visio', slug: 'microsoft-visio' },
  { name: 'Office for Mac', slug: 'office-for-mac' },
  { name: 'Windows OS', slug: 'windows-os' },
  { name: 'McAfee Antivirus', slug: 'mcafee-antivirus' },
  { name: 'Antivirus', slug: 'antivirus' },
];

export const testimonials = [
  {
    name: 'Brandon Koch',
    initials: 'BK',
    location: 'Mn, USA',
    product: 'Microsoft Office',
    text: "I ordered software from them and when it didn't work I called the customer service and I could not understand the guy, he spoke very poor English and I couldn't even understand what he said. So I just canceled it and then he didn't want to refund me. I would not deal with them again.",
    rating: 3,
  },
  {
    name: 'Alyssa Dickens',
    initials: 'AD',
    location: 'USA',
    product: 'Microsoft Office',
    text: 'Overall the site was easy to use and had clear step-by-step instructions.',
    rating: 5,
  },
  {
    name: 'ALBERT CHAPMAN',
    initials: 'AC',
    location: 'New York, USA',
    product: 'Microsoft Office',
    text: 'I like the price. The only problem was that Microsoft stopped it from working and I had to get the company to fix the problem which they did in a timely manner.',
    rating: 4,
  },
  {
    name: 'Mike H',
    initials: 'MH',
    location: 'NH, USA',
    product: 'Microsoft Office',
    text: "Easy to find the software I needed: Office & VISIO. The staff were amazing after I had some initial machine compatibility issues. They resolved everything so quickly. I've got a full set of current software. Mike",
    rating: 5,
  },
  {
    name: 'bill delp',
    initials: 'BD',
    location: 'USA',
    product: 'Microsoft Office',
    text: 'The software works. Had to load a new laptop.',
    rating: 5,
  },
  {
    name: 'Dana',
    initials: 'D',
    location: 'Nebraska, USA',
    product: 'Microsoft Office',
    text: 'I never got help and never got my software installed.',
    rating: 2,
  },
];

export const faqs = [
  {
    q: 'Are these genuine Microsoft Office licenses?',
    a: 'Yes, all our licenses are 100% genuine and sourced directly from authorized Microsoft distributors. Every license key is verified for authenticity before delivery.',
  },
  {
    q: 'What is a perpetual license?',
    a: 'A perpetual license means you own the software forever with a one-time purchase. There are no recurring subscription fees, and you can use the software for as long as you want.',
  },
  {
    q: 'How quickly will I receive my license key?',
    a: 'License keys are delivered via email within 15-30 minutes of successful payment confirmation. You will receive download instructions along with your activation key.',
  },
  {
    q: 'Can I install this on multiple computers?',
    a: 'Each license is valid for one device. If you need licenses for multiple computers, please contact our sales team for volume discounts.',
  },
  {
    q: 'What if I need technical support?',
    a: 'Our expert support team is available Monday through Saturday, 9 AM to 6 PM EST. We provide free professional support for installation, activation, and any issues you may encounter.',
  },
  {
    q: 'Is my payment information secure?',
    a: 'Absolutely. Our checkout is SSL-encrypted and PCI-compliant. We never store your payment details on our servers and use trusted payment processors for all transactions.',
  },
];

export const blogPosts = [
  {
    id: 'why-upgrade-office-2024',
    title: 'Why You Should Upgrade to Microsoft Office 2024 Today',
    date: 'Mar 18, 2026',
    readTime: '5 min read',
    image: 'https://images.pexels.com/photos/2102416/pexels-photo-2102416.jpeg',
  },
  {
    id: 'office-2019-vs-2021-mac',
    title: 'Microsoft Office 2019 vs. 2021 for Mac: Which Version Should You Choose?',
    date: 'Jan 30, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1649433391420-542fcd3835ea?q=80&w=870&auto=format&fit=crop',
  },
  {
    id: 'home-business-2024-features',
    title: 'MS Office Home and Business 2024: Features for Modern Businesses',
    date: 'Jan 21, 2026',
    readTime: '11 min read',
    image: 'https://images.unsplash.com/photo-1632239776255-0a7f24814df2?q=80&w=871&auto=format&fit=crop',
  },
];

export const trustLogos = [
  { name: 'CMS Electric Cooperative', src: 'https://gosoftwarebuy.com/assets/MD-CW_Logo_0_1765599564630-Cav6yY1W.png' },
  { name: 'BART', src: 'https://gosoftwarebuy.com/assets/Bart-logo.svg_1765599564630-ZxjpAnI8.png' },
  { name: 'NTIA', src: 'https://gosoftwarebuy.com/assets/NTIA-logo.svg_1765599564630-BsXyBLKB.png' },
  { name: 'NOAA', src: 'https://gosoftwarebuy.com/assets/noaa_digital_logo-2022_1765599564636-j-mXQO1J.png' },
  { name: 'UPS', src: 'https://gosoftwarebuy.com/assets/UPS-Logo-2003-2014_1765599564637-BCL3rYyy.png' },
  { name: 'Royal Roads University', src: 'https://gosoftwarebuy.com/assets/rru-logo_4c_vert_pos-2500w_1765599564637-DxXK6Z3c.png' },
];

export const appIcons = {
  word: 'https://gosoftwarebuy.com/assets/Microsoft_Office_Word_1765865381845-Cby-XFtN.png',
  excel: 'https://gosoftwarebuy.com/assets/excel_1765865381846-Ch1DG1gu.jpeg',
  powerpoint: 'https://gosoftwarebuy.com/assets/Microsoft_Office_PowerPoint_1765865381846-CB2GUPqO.png',
  outlook: 'https://gosoftwarebuy.com/assets/Microsoft_Outlook_Icon_1765865381846-DMb4j-mZ.png',
  access: 'https://gosoftwarebuy.com/assets/Microsoft_Office_Access_1765865381846-C4OFiOlK.png',
};
