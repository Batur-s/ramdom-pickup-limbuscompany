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
        {
      id: 'id-3',
      name: 'W사 3등급 정리 요원 돈키호테',
      sinnerId: 'sinner-3',
      grade: 3,
      tier: Tier.S,
    },
        {
      id: 'id-4',
      name: '흑운회 와카슈 로슈',
      sinnerId: 'sinner-4',
      grade: 3,
      tier: Tier.S,
    },
        {
      id: 'id-5',
      name: 'W사 2등급 정리 요원 뫼르소',
      sinnerId: 'sinner-5',
      grade: 3,
      tier: Tier.S,
    },
        {
      id: 'id-6',
      name: '콩콩이파 두목 홍루',
      sinnerId: 'sinner-6',
      grade: 3,
      tier: Tier.S,
    },
        {
      id: 'id-7',
      name: 'R사 제 4무리 토끼팀 히스클리프',
      sinnerId: 'sinner-7',
      grade: 3,
      tier: Tier.S,
    },
        {
      id: 'id-8',
      name: 'R사 제 4무리 순록팀 이스마엘',
      sinnerId: 'sinner-8',
      grade: 3,
      tier: Tier.S,
    },
        {
      id: 'id-9',
      name: '흑운회 와카슈 로쟈',
      sinnerId: 'sinner-9',
      grade: 3,
      tier: Tier.S,
    },
        {
      id: 'id-10',
      name: '검계 살수 싱클레어',
      sinnerId: 'sinner-10',
      grade: 3,
      tier: Tier.S,
    },
        {
      id: 'id-11',
      name: '남부 세븐 협회 6과 부장 오티스',
      sinnerId: 'sinner-11',
      grade: 3,
      tier: Tier.S,
    },
        {
      id: 'id-12',
      name: 'G사 일등대리 그레고르',
      sinnerId: 'sinner-12',
      grade: 3,
      tier: Tier.S,
    },
  ];

  for (const identity of identitiesData) {
    await prisma.identity.upsert({
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
    console.error('❌ 시딩 중 에러 발생:');
    console.error(e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
