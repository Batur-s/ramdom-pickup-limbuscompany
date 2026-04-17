import { Router } from 'express';
import { updateIdentities } from './user.controller'; // 컨트롤러 구현 필요

const router = Router();

// 인벤토리 저장 및 조회 예시
// router.get('/inventory', getInventory);
router.post('/identities', updateIdentities);

export default router;