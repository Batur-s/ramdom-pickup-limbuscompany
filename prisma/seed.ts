import { PrismaClient, Tier } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function readIdentitiesJson() {
  const filePath = path.join(process.cwd(), 'prisma', 'seed-data', 'identities.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as Array<{
    id: string;
    name: string;
    sinnerId: string;
    grade: number;
    tier: keyof typeof Tier;
  }>;
}

async function main() {
  console.log('🌱 시딩 시작...');

  const sinnersData = [
    { id: 'sinner-1', name: '이상' },
    { id: 'sinner-2', name: '파우스트' },
    { id: 'sinner-3', name: '돈키호테' },
    { id: 'sinner-4', name: '료슈' },
    { id: 'sinner-5', name: '뫼르소' },
    { id: 'sinner-6', name: '홍루' },
    { id: 'sinner-7', name: '히스클리프' },
    { id: 'sinner-8', name: '이스마엘' },
    { id: 'sinner-9', name: '로쟈' },
    { id: 'sinner-10', name: '싱클레어' },
    { id: 'sinner-11', name: '오티스' },
    { id: 'sinner-12', name: '그레고르' },
  ];
  for (const s of sinnersData) {
    await prisma.sinners.upsert({
      where: { id: s.id },
      update: { name: s.name },
      create: s,
    });
  }
  console.log('👥 수감자 데이터 완료');

  const identitiesData = readIdentitiesJson();

  for (const identity of identitiesData) {
    await prisma.identity.upsert({
      where: { id: identity.id },
      update: {
        name: identity.name,
        sinnerId: identity.sinnerId,
        grade: identity.grade,
        tier: identity.tier as Tier,
      },
      create: {
        id: identity.id,
        name: identity.name,
        sinnerId: identity.sinnerId,
        grade: identity.grade,
        tier: identity.tier as Tier,
      },
    });
  }

  console.log('✅ 모든 시딩 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 시딩 중 에러 발생:');
    console.error((e as Error).message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
