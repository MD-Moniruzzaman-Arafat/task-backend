require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/Job');
const Application = require('./models/Application');

const sampleJobs = [
  {
    title: 'Senior Frontend Engineer',
    company: 'TechVenture Inc.',
    location: 'San Francisco, CA (Remote)',
    category: 'Engineering',
    description:
      'We are looking for a Senior Frontend Engineer to join our growing team. You will be building user-facing features using React, TypeScript, and modern tooling. Strong knowledge of performance optimization, testing, and design systems required.',
    salary_range: '$130,000 – $170,000',
    job_type: 'Full-time',
  },
  {
    title: 'Product Designer',
    company: 'DesignFirst Studio',
    location: 'New York, NY',
    category: 'Design',
    description:
      'DesignFirst is seeking a Product Designer who can turn complex problems into elegant digital experiences. You will work closely with our product and engineering teams to ship features used by millions. Figma expertise and a strong portfolio required.',
    salary_range: '$90,000 – $120,000',
    job_type: 'Full-time',
  },
  {
    title: 'Backend Engineer (Node.js)',
    company: 'CloudCore Systems',
    location: 'Remote',
    category: 'Engineering',
    description:
      'CloudCore is hiring a Backend Engineer to scale our infrastructure. You will design and implement REST APIs, optimize database queries, and contribute to our microservices architecture. 3+ years experience with Node.js and MongoDB or PostgreSQL required.',
    salary_range: '$115,000 – $150,000',
    job_type: 'Full-time',
  },
  {
    title: 'Growth Marketing Manager',
    company: 'LaunchPad Co.',
    location: 'Austin, TX',
    category: 'Marketing',
    description:
      'LaunchPad Co. is looking for a data-driven Growth Marketing Manager to own our user acquisition and retention strategies. You will run experiments across paid, SEO, and email channels. Experience with analytics tools and A/B testing required.',
    salary_range: '$80,000 – $105,000',
    job_type: 'Full-time',
  },
  {
    title: 'Data Analyst',
    company: 'Insightful Analytics',
    location: 'Chicago, IL (Hybrid)',
    category: 'Data',
    description:
      'Join our analytics team and help transform raw data into actionable insights. You will build dashboards, run SQL queries, and present findings to leadership. Strong SQL, Python, and data visualization skills required.',
    salary_range: '$75,000 – $95,000',
    job_type: 'Full-time',
  },
  {
    title: 'DevOps Engineer',
    company: 'InfraOps Ltd.',
    location: 'Remote',
    category: 'Engineering',
    description:
      'InfraOps is seeking a DevOps Engineer to help us build and maintain our CI/CD pipelines and cloud infrastructure. Experience with AWS/GCP, Terraform, Docker, and Kubernetes is required.',
    salary_range: '$120,000 – $155,000',
    job_type: 'Contract',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('🗑️  Cleared existing data');

    const jobs = await Job.insertMany(sampleJobs);
    console.log(`🌱 Seeded ${jobs.length} jobs`);

    console.log('\n📋 Job IDs for testing:');
    jobs.forEach((job) => console.log(`   ${job.title}: ${job._id}`));

    console.log('\n✅ Database seeded successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
