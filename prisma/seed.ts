import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.hourEntry.deleteMany();
  await prisma.request.deleteMany();
  await prisma.user.deleteMany();
  await prisma.template.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.galleryProject.deleteMany();
  await prisma.galleryCategory.deleteMany();
  await prisma.teamMember.deleteMany();

  await prisma.user.create({
    data: {
      name: "Arun Chacko",
      email: "arun.chacko@kpmg.com",
      role: "Designer",
      avatar: "https://i.pravatar.cc/150?u=arun",
      organization: "KGS Consulting",
    },
  });

  const requests = [
    {
      projectNumber: 509465,
      projectName: "R&R Mailers FY'26/HR",
      category: "Emailer",
      createdOnBehalfOf: "Chacko, Arun",
      requestSummary: "Create R&R mailers for FY'26 recognition program.",
      message: "Celebrate outstanding contributions across the firm.",
      teamName: "HR",
      targetAudienceGeo: "Global",
      requestedOn: new Date("2025-11-01"),
      deadline: new Date("2025-11-30"),
      targetReleaseDate: new Date("2025-11-28"),
      status: "Design in progress",
      requestedBy: "Chacko, Arun",
    },
    {
      projectNumber: 385566,
      projectName: "Communication request",
      category: "Newsletter",
      createdOnBehalfOf: "Chacko, Arun",
      requestSummary: "Please create a newsletter for the upcoming GPS survey.",
      message: "Help us map the future—join our upcoming GPS survey and make your location count!",
      creativeSuggestion: "Pin your place on the map of progress—be part of our GPS survey and shape tomorrow's terrain!",
      primaryAudience: "All consulting",
      teamName: "HR",
      targetAudienceGeo: "US",
      requestedOn: new Date("2025-07-01"),
      deadline: new Date("2025-07-11"),
      targetReleaseDate: new Date("2025-07-11"),
      status: "Brief submitted",
      requestedBy: "Chacko, Arun",
    },
    {
      projectNumber: 711131,
      projectName: "Advisory Enablement CSR video",
      category: "Video",
      createdOnBehalfOf: "Tanwar, Dheeraj",
      requestSummary: "CSR video for advisory enablement initiative.",
      description: "Short-form video highlighting CSR initiatives and community impact.",
      teamName: "Advisory",
      targetAudienceGeo: "Global",
      requestedOn: new Date("2025-06-15"),
      deadline: new Date("2025-07-20"),
      status: "Completed",
      requestedBy: "Tanwar, Dheeraj",
    },
    {
      projectNumber: 498221,
      projectName: "CultureVerse - Campaign/HR",
      category: "Emailer",
      createdOnBehalfOf: "Rakshit, Abhirup",
      requestSummary: "CultureVerse campaign email series.",
      teamName: "HR",
      targetAudienceGeo: "US",
      requestedOn: new Date("2025-10-10"),
      deadline: new Date("2025-11-15"),
      status: "Draft delivered",
      requestedBy: "Rakshit, Abhirup",
    },
    {
      projectNumber: 512890,
      projectName: "GPS 2025 - Score Announcement",
      category: "Presentation",
      createdOnBehalfOf: "Vibhakar, Varun",
      requestSummary: "GPS 2025 score announcement deck.",
      teamName: "Consulting",
      targetAudienceGeo: "Global",
      requestedOn: new Date("2025-09-01"),
      deadline: new Date("2025-10-01"),
      status: "Completed",
      requestedBy: "Vibhakar, Varun",
    },
    {
      projectNumber: 445102,
      projectName: "Konsulting Kapsule/Technology",
      category: "Newsletter",
      createdOnBehalfOf: "Chacko, Arun",
      requestSummary: "Monthly technology newsletter.",
      teamName: "Technology",
      targetAudienceGeo: "Global",
      requestedOn: new Date("2025-08-20"),
      status: "Brief submitted",
      requestedBy: "Chacko, Arun",
    },
    {
      projectNumber: 467334,
      projectName: "Employee Engagement Town Hall",
      category: "Presentation",
      createdOnBehalfOf: "Rakshit, Abhirup",
      requestSummary: "Town hall presentation materials.",
      teamName: "HR",
      targetAudienceGeo: "US",
      requestedOn: new Date("2025-07-15"),
      deadline: new Date("2025-08-01"),
      status: "Design in progress",
      requestedBy: "Rakshit, Abhirup",
    },
    {
      projectNumber: 489776,
      projectName: "Honeywell Client Visit Materials",
      category: "Infographic",
      createdOnBehalfOf: "Tanwar, Dheeraj",
      requestSummary: "Client visit welcome materials.",
      teamName: "Consulting",
      targetAudienceGeo: "US",
      requestedOn: new Date("2025-11-05"),
      deadline: new Date("2025-11-20"),
      status: "Draft delivered",
      requestedBy: "Tanwar, Dheeraj",
    },
  ];

  for (const req of requests) {
    await prisma.request.create({ data: req });
  }

  const templates = [
    { name: "Alert mailer 01", fileType: "OFT" },
    { name: "Alert mailer 01 editable banner", fileType: "PPT" },
    { name: "Learning email 01", fileType: "OFT" },
    { name: "Learning email 01 editable banner", fileType: "PPT" },
    { name: "Technology email 01", fileType: "OFT" },
    { name: "Technology email 01 editable banner", fileType: "PPT" },
  ];
  for (const t of templates) {
    await prisma.template.create({ data: t });
  }

  const novEvents = [
    { title: "Rob Fisher's video", date: new Date("2025-11-03"), color: "#22c55e", type: "delivery" },
    { title: "Advisory town hall", date: new Date("2025-11-05"), color: "#4ebce9", type: "delivery" },
    { title: "CultureVerse - Campa", date: new Date("2025-11-07"), color: "#1a3a6b", type: "delivery" },
    { title: "GPS 2025 - Score Ann", date: new Date("2025-11-10"), color: "#0d9488", type: "delivery" },
    { title: "R&R FY'26 Nomination", date: new Date("2025-11-12"), color: "#e91e8c", type: "delivery" },
    { title: "Honeywell client vis", date: new Date("2025-11-14"), color: "#22c55e", type: "delivery" },
    { title: "Employee Engagement", date: new Date("2025-11-18"), color: "#4ebce9", type: "delivery" },
    { title: "Konsulting Kapsule", date: new Date("2025-11-20"), color: "#ef4444", type: "delivery" },
    { title: "Presentation Skills", date: new Date("2025-11-22"), color: "#e91e8c", type: "delivery" },
    { title: "November - Meeting h", date: new Date("2025-11-25"), color: "#ef4444", type: "delivery" },
  ];

  const julEvents = [
    { title: "Kommunicate - Phase", date: new Date("2025-07-01"), color: "#1a3a6b", type: "release" },
    { title: "Kommunicate - Phase", date: new Date("2025-07-04"), color: "#1a3a6b", type: "release" },
    { title: "Kommunicate - Phase", date: new Date("2025-07-08"), color: "#1a3a6b", type: "release" },
    { title: "KGS US Consulting Bu", date: new Date("2025-07-09"), color: "#4ebce9", type: "release" },
    { title: "Kommunicate Phase 2", date: new Date("2025-07-11"), color: "#1a3a6b", type: "release" },
  ];

  for (const e of [...novEvents, ...julEvents]) {
    await prisma.calendarEvent.create({ data: e });
  }

  const projects = [
    { title: "Culture Chronicles", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", order: 1 },
    { title: "GPS 2023", imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=400&fit=crop", order: 2 },
    { title: "IDE All", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop", order: 3 },
    { title: "Kaptivate with Gen-AI", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop", order: 4 },
    { title: "Knowledge Quest", imageUrl: "https://images.unsplash.com/photo-1507838153414-b4b713184a03?w=400&h=400&fit=crop", order: 5 },
    { title: "Performance Development FY23-24", imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop", order: 6 },
  ];
  for (const p of projects) {
    await prisma.galleryProject.create({ data: p });
  }

  const categories = [
    { title: "Guidelines", gradient: "from-[#4ebce9] to-[#38bdf8]", hasPptIcon: true, order: 1 },
    { title: "Case studies", gradient: "from-[#1a3a6b] to-[#0f2744]", hasPptIcon: false, order: 2 },
    { title: "Consulting overview Deck", gradient: "from-[#7c3aed] to-[#4ebce9]", hasPptIcon: true, order: 3 },
  ];
  for (const c of categories) {
    await prisma.galleryCategory.create({ data: c });
  }

  const team = [
    { name: "Rakshit, Abhirup", email: "abhiruprakshit@kpmg.com", role: "Communication lead", avatar: "https://i.pravatar.cc/150?u=abhirup" },
    { name: "Tanwar, Dheeraj", email: "dheerajtanwar@kpmg.com", role: "Design lead", avatar: "https://i.pravatar.cc/150?u=dheeraj" },
    { name: "Chacko, Arun", email: "arun.chacko@kpmg.com", role: "Designer", avatar: "https://i.pravatar.cc/150?u=arun2" },
    { name: "Vibhakar M, Varun", email: "varunvibhakar@kpmg.com", role: "Content lead", avatar: "https://i.pravatar.cc/150?u=varun" },
  ];
  for (const m of team) {
    await prisma.teamMember.create({ data: m });
  }

  const req509465 = await prisma.request.findUnique({ where: { projectNumber: 509465 } });
  if (req509465) {
    await prisma.hourEntry.create({
      data: {
        requestId: req509465.id,
        hours: 4.5,
        category: "Design",
        subCategory: "Layout",
        date: new Date("2025-11-20"),
        remarks: "Initial layout design",
        effortSpentBy: "Chacko, Arun",
      },
    });
    await prisma.hourEntry.create({
      data: {
        requestId: req509465.id,
        hours: 2.25,
        category: "Content",
        subCategory: "Copywriting",
        date: new Date("2025-11-21"),
        remarks: "Copy review",
        effortSpentBy: "Chacko, Arun",
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
