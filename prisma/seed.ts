import { PrismaClient, Tier } from '@prisma/client';
const prisma = new PrismaClient();

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

  const identitiesData = [
    {
      id: 'id-1',
      name: '검계 살수 이상',
      sinnerId: 'sinner-1', // 위에서 만든 수감자 ID와 연결
      grade: 3,
      tier: Tier.S, // Prisma Enum 사용
    },
    {
      id: 'id-2',
      name: '쥐는 자 파우스트',
      sinnerId: 'sinner-2',
      grade: 3,
      tier: Tier.S,
    },
  ];

  for (const identity of identitiesData) {
    await prisma.identities.upsert({
      where: { id: identity.id },
      update: {
        name: identity.name,
        tier: identity.tier,
      },
      create: identity,
    });
  }

  console.log('✅ 모든 시딩 완료!');
}

main()
  .catch((e) => {
    // Prisma 에러인지 일반 에러인지 구분해서 출력해줍니다.
    console.error("❌ 시딩 중 에러 발생:");
    console.error(e.message); 
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
