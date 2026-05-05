import { PrismaClient, Tier } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

function readJsonFile<T>(fileName: string): T {
  const filePath = path.join(process.cwd(), 'prisma', 'seed-data', fileName);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

type IdentitySeedRow = {
  id: string;
  name: string;
  sinnerId: string;
  grade: number;
  tier: keyof typeof Tier;
  imageUrl: string;
};

type StageSeedRow = {
  id: string;
  name: string;
  normalFloorA: number | null;
  normalFloorB: number | null;
  hardFloorA: number | null;
  hardFloorB: number | null;
};

async function main() {
  console.log('🌱 시딩 시작...');

  const sinnersData = [
    {
      id: 'sinner-1',
      name: '이상',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878555/284e74b6af8de303a9bd8c51a7a2530cfac4e75da6872608ad9ef1875675081c_lklp7p.webp',
    },
    {
      id: 'sinner-2',
      name: '파우스트',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878554/af996e2123de09630e9d41dbbbf97b1a8cc325541e4c5b804e87c83106bbeffa_in7slm.webp',
    },
    {
      id: 'sinner-3',
      name: '돈키호테',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878555/177cf4e646bd49ea30da48f90bb4ff81c074deee0fc8f64af55f0661365a2da7_fxgjsn.webp',
    },
    {
      id: 'sinner-4',
      name: '료슈',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878555/a330b09e1c22fe96d87646d08bbf40ed926edc6b89b0600db483954023d8de18_g5phx2.webp',
    },
    {
      id: 'sinner-5',
      name: '뫼르소',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878555/c3a97372123886afcc9c9052522ef32ff7a7e096b607441d8580f5371babb999_klniui.webp',
    },
    {
      id: 'sinner-6',
      name: '홍루',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878554/0efc946b8179e4118be00c432ad8cee71ecf700921ad6dff6e22b10c1a3b1c4b_hhxpsh.webp',
    },
    {
      id: 'sinner-7',
      name: '히스클리프',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878556/3f3e5c51313a553aa22880508a2b974b46f14eb43ceb56ca739ba7017282156a_xvmxsg.webp',
    },
    {
      id: 'sinner-8',
      name: '이스마엘',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878554/1df7baf1d2c387188c1e217aaef48c9145d76526120816a6ed979a24391b7b54_lnffw2.webp',
    },
    {
      id: 'sinner-9',
      name: '로쟈',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878557/051d6af94b23b28c3077337fff1d986e1104fdea37df271ac7e4cc6b8361934f_aihy2s.webp',
    },
    {
      id: 'sinner-10',
      name: '싱클레어',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878556/39676257627edb0ca3fc6c5abd3bc70588680a0b153e7038944f89ea02469094_jg9khf.webp',
    },
    {
      id: 'sinner-11',
      name: '오티스',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878557/bb413cb13bb8be2e944c45054fe0e95ae6590b8c38a78442d7d69337880c58e8_nzxgse.webp',
    },
    {
      id: 'sinner-12',
      name: '그레고르',
      imageUrl:
        'https://res.cloudinary.com/dp5elyh8p/image/upload/v1777878555/31932bb98ac64d1a0cd2bec2ade3caeb41afa82bd54786cc455b76df5d12dba8_ejjp6e.webp',
    },
  ];
  for (const s of sinnersData) {
    await prisma.sinners.upsert({
      where: { id: s.id },
      update: { name: s.name, imageUrl: s.imageUrl },
      create: s,
    });
  }
  console.log('👥 수감자 데이터 완료');

  const identitiesData = readJsonFile<IdentitySeedRow[]>('identities.json');

  for (const identity of identitiesData) {
    await prisma.identity.upsert({
      where: { id: identity.id },
      update: {
        name: identity.name,
        sinnerId: identity.sinnerId,
        grade: identity.grade,
        tier: identity.tier as Tier,
        imageUrl: identity.imageUrl,
      },
      create: {
        id: identity.id,
        name: identity.name,
        sinnerId: identity.sinnerId,
        grade: identity.grade,
        tier: identity.tier as Tier,
        imageUrl: identity.imageUrl,
      },
    });
  }
  console.log('✅ identities 시딩 완료!');

  const stagesData = readJsonFile<StageSeedRow[]>('stages.json');

  for (const stage of stagesData) {
    await prisma.stages.upsert({
      where: { id: stage.id },
      update: {
        name: stage.name,
        normalFloorA: stage.normalFloorA,
        normalFloorB: stage.normalFloorB,
        hardFloorA: stage.hardFloorA,
        hardFloorB: stage.hardFloorB,
      },
      create: {
        id: stage.id,
        name: stage.name,
        normalFloorA: stage.normalFloorA,
        normalFloorB: stage.normalFloorB,
        hardFloorA: stage.hardFloorA,
        hardFloorB: stage.hardFloorB,
      },
    });
  }
  console.log('✅ stages 시딩 완료!');

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
