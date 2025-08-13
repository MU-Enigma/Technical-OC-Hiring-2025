import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.blog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.event.deleteMany();

  //dummy users
  const ada = await prisma.user.create({
    data: {
      name: "Ada",
      email: "ada@example.com",
      hashedPassword: "$2a$10$EXAMPLEHASHEDPASSWORD1234",
    },
  });

  const babbage = await prisma.user.create({
    data: {
      name: "Babbage",
      email: "babbage@example.com",
      hashedPassword: "$2a$10$EXAMPLEHASHEDPASSWORD1234",
    },
  });

  //dummy blogs
  await prisma.blog.createMany({
    data: [
      {
        title: "Test",
        content: "My First Blog",
        posted: true,
        authorId: ada.id,
        updatedAt: new Date(),
      },
      {
        title: "Test",
        content: "My First Blog",
        posted: true,
        authorId: babbage.id,
        updatedAt: new Date(),
      },
      {
        title: "Test",
        content: "My First Blog",
        posted: true,
        authorId: babbage.id,
        updatedAt: new Date(),
      },
      {
        title: "Test",
        content: "My First Blog",
        posted: true,
        authorId: babbage.id,
        updatedAt: new Date(),
      },
      {
        title: "Test",
        content: "My First Blog",
        posted: true,
        authorId: ada.id,
        updatedAt: new Date(),
      },
      {
        title: "Test",
        content: "My First Blog",
        posted: false,
        authorId: ada.id,
        updatedAt: new Date(),
      },
      {
        title: "Test",
        content: "My First Blog",
        posted: false,
        authorId: ada.id,
        updatedAt: new Date(),
      },
    ],
  });

  // dummy events
  await prisma.event.createMany({
    data: [
      {
        title: "hackathon",
        desc: "overnight coding event",
        location: "Audiotrium",
        date: "2025-08-10T18:00:00.000Z",
        userId: babbage.id,
      },
      {
        title: "hackathon",
        desc: "overnight coding event",
        location: "Audiotrium",
        date: "2025-08-10T18:00:00.000Z",
        userId: babbage.id,
      },
      {
        title: "hackathon",
        desc: "overnight coding event",
        location: "Audiotrium",
        date: "2025-08-10T18:00:00.000Z",
        userId: babbage.id,
      },
      {
        title: "hackathon",
        desc: "overnight coding event",
        location: "Audiotrium",
        date: "2025-08-10T18:00:00.000Z",
        userId: babbage.id,
      },
      {
        title: "hackathon",
        desc: "overnight coding event",
        location: "Audiotrium",
        date: "2025-08-10T18:00:00.000Z",
        userId: babbage.id,
      },
    ],
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async function () {
    await prisma.$disconnect();
  });
