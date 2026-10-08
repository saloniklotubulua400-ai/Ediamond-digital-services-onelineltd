// All services from the Ediamond poster. Edit text here and every page updates.
const S = (slug, title, color, summary, items) => ({ slug, title, color, summary, items });

export const GROUPS = [
  {
    name: 'Build',
    blurb: 'Websites, apps and software made for your business.',
    services: [
      S('web-development', 'Web Development', '#1f6fe5',
        'Websites that work on every phone and bring in enquiries, from a one-page profile to a full booking site.',
        ['Business websites', 'Company websites', 'Personal portfolios', 'NGO & Church websites', 'Hotel & Restaurant websites', 'Real-estate websites', 'E-commerce websites', 'Landing pages & blogs', 'Event & Booking websites', 'Membership & Online course sites']),
      S('mobile-app-development', 'Mobile App Development', '#b5339b',
        'Android, iOS and cross-platform apps for your customers or your own team.',
        ['Android applications', 'iOS applications', 'Cross-platform apps', 'Business apps', 'Booking apps', 'Delivery apps', 'School apps', 'E-commerce apps', 'Customer management apps', 'Internal company apps']),
      S('software-development', 'Software Development', '#c98f00',
        'Custom web apps, SaaS products, customer portals and back-end systems built around how you work.',
        ['Web applications', 'Business applications', 'SaaS applications', 'Internal company systems', 'Customer portals', 'Admin dashboards', 'Management systems', 'REST APIs & backend systems', 'Database applications']),
      S('ecommerce-services', 'E-commerce Services', '#7a3fd1',
        'Online shops with catalogues, carts, checkout, orders, delivery tracking and an admin dashboard.',
        ['Online shops', 'Product catalogues', 'Shopping carts', 'Checkout systems', 'Payment integration', 'Order management', 'Customer accounts', 'Inventory tracking', 'Delivery tracking', 'Admin dashboards']),
      S('business-management-systems', 'Business Management Systems', '#19a463',
        'Software to run daily operations: sales, stock, staff, appointments, invoices and reports in one place.',
        ['POS systems', 'Inventory & Stock management', 'Sales management', 'Customer management', 'Employee management', 'Appointment & Booking systems', 'School & Hotel management', 'Pharmacy management', 'Rental management', 'Invoice & Expense tracking', 'Reporting dashboards']),
      S('professional-digital-services', 'Professional Digital Services', '#12a58a',
        'Portfolios, CV websites, business profiles, online forms and digital record systems.',
        ['Portfolio development', 'Developer CV websites', 'Business profiles', 'Online application forms', 'Document automation', 'PDF generation systems', 'Online registration systems', 'Digital record systems']),
    ],
  },
  {
    name: 'Connect & automate',
    blurb: 'Link your tools, take payments and save time on repeat work.',
    services: [
      S('whatsapp-automation', 'WhatsApp & Communication Automation', '#12a58a',
        'Reply to customers, take orders and send reminders automatically on WhatsApp, SMS and email.',
        ['WhatsApp business automation', 'Automated customer responses', 'Order & booking systems', 'WhatsApp notifications', 'SMS notifications', 'Email automation', 'Customer & appointment reminders', 'Marketing automation', 'Lead collection']),
      S('api-integration', 'API Integration', '#d6242f',
        'Connect your system to M-Pesa, SMS, WhatsApp, maps, AI and the other services you already use.',
        ['Payment API integration', 'M-Pesa integration', 'SMS & Email integration', 'WhatsApp API integration', 'AI API integration', 'Maps API integration', 'Authentication APIs', 'E-commerce APIs', 'Third-party integration', 'Webhooks & REST APIs']),
      S('payment-solutions', 'Payment Solutions', '#1b6ee0',
        'Accept M-Pesa, card and mobile payments, verify them automatically and track every transaction.',
        ['Payment gateway integration', 'M-Pesa integration', 'Card payments', 'Mobile payments', 'Online checkout', 'Payment verification', 'Transaction tracking', 'Payment dashboards', 'Automated receipts', 'Subscription payments']),
      S('automation-services', 'Automation Services', '#e0307a',
        'Automate orders, registrations, invoices, reminders and data entry so nothing gets missed.',
        ['Sales & order automation', 'Customer registration', 'Appointment systems', 'Reporting & notifications', 'Email & SMS automation', 'Invoice generation', 'Data entry automation', 'Lead collection']),
    ],
  },
  {
    name: 'Data & AI',
    blurb: 'Turn your data into decisions and put AI to work.',
    services: [
      S('ai-services', 'AI Services', '#f5821f',
        'Chatbots, document processing and automation that save your team hours of repeat work.',
        ['AI chatbots & assistants', 'AI document processing', 'AI content automation', 'AI data analysis', 'Recommendation systems', 'Image classification', 'Business automation', 'AI-powered search', 'Report generation', 'AI workflow integration']),
      S('machine-learning', 'Machine Learning', '#7a3fd1',
        'Prediction, classification, recommendation and vision models, built, tested and deployed as APIs.',
        ['Prediction systems', 'Classification systems', 'Recommendation systems', 'Data preprocessing', 'Model development', 'Model evaluation', 'ML API deployment', 'AI prototypes', 'Computer vision', 'NLP applications']),
      S('data-analytics', 'Data & Analytics', '#1b6ee0',
        'Clean your data and turn it into dashboards, reports and insights you can act on.',
        ['Data cleaning & analysis', 'Business dashboards', 'Sales reports', 'Customer analytics', 'Excel automation', 'Data visualization', 'Database design', 'SQL reporting', 'Business intelligence', 'Predictive analytics']),
    ],
  },
  {
    name: 'Run & protect',
    blurb: 'Keep your website and software online, secure and fixed.',
    services: [
      S('hosting-deployment', 'Hosting & Deployment', '#4a52d6',
        'Domains, SSL, hosting, DNS and deployment set up properly, plus migrations and backups.',
        ['Domain setup', 'Hosting configuration', 'SSL setup', 'Website deployment', 'Vercel deployment', 'Server deployment', 'DNS configuration', 'Database deployment', 'Cloud configuration', 'Website migration & backups']),
      S('cybersecurity', 'Cybersecurity Services', '#d6242f',
        'Security checks and safeguards for your website, logins, APIs and databases.',
        ['Website security checks', 'Security configuration', 'Authentication implementation', 'Role-based access control', 'Password security', 'API security', 'Secure database configuration', 'Security best practices', 'Backup strategies', 'Vulnerability assessments']),
      S('website-software-fixing', 'Website & Software Fixing', '#12a58a',
        'Something broken? We debug code, databases, layouts, deployments and hosting problems.',
        ['React & JavaScript bug fixing', 'Node.js debugging', 'API troubleshooting', 'Firebase issues', 'Database errors', 'CSS problems', 'Responsive design fixes', 'Deployment problems', 'Git/GitHub issues', 'Hosting problems']),
      S('monthly-maintenance', 'Monthly Maintenance', '#1b6ee0',
        'A monthly plan that keeps your site updated, backed up and secure, and fixed when something breaks.',
        ['Website updates', 'Bug fixing & support', 'Security updates', 'Backups', 'Content updates', 'Performance monitoring', 'Small feature changes', 'Hosting management']),
    ],
  },
  {
    name: 'Learn & grow',
    blurb: 'Skills for your team and the right software for your business.',
    services: [
      S('developer-training', 'Developer Training', '#19a463',
        'One-on-one and group classes in web development, Git, React, Node.js, Python and data science.',
        ['HTML, CSS, JavaScript', 'Git & GitHub', 'React & Node.js', 'Python & Data Science', 'AI/ML deployment', 'Cloud deployment', 'Software architecture', 'One-on-one & group classes']),
      S('software-reselling', 'Software Reselling & Implementation', '#5b3fc4',
        'We recommend, set up and customise CRM, accounting, HR and other business software for you.',
        ['CRM systems', 'Accounting software', 'HR software', 'Project management tools', 'Marketing tools', 'AI tools', 'Business automation tools', 'Communication platforms', 'E-commerce tools']),
    ],
  },
];

export const SERVICES = GROUPS.flatMap((g) => g.services.map((s) => ({ ...s, group: g.name })));
export const getService = (slug) => SERVICES.find((s) => s.slug === slug);

export const TRUST = [
  { icon: 'Lightbulb', label: 'Custom solutions' },
  { icon: 'ShieldCheck', label: 'Reliable & secure' },
  { icon: 'Rocket', label: 'On-time delivery' },
  { icon: 'Headset', label: 'Ongoing support' },
];
