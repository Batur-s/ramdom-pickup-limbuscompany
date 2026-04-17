import { Request, Response } from 'express';
import * as userService from './user.service';

// export const getMe = (req: Request, res: Response) => {
//   if (!req.user) {
//     return res.status(401).json({ message: '인증되지 않은 사용자입니다' });
//   }
//   res.json(req.user);
// };

export const updateIdentities = async (req: Request, res: Response) => {
  try {
    const { identityIds } = req.body;
    const userId = req.user as any; // Passport에서 넣어준 정보

    await userService.syncInventory(userId, identityIds);
    res.status(200).json({ message: '인벤토리가 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '인벤토리 저장 중 오류 발생' });
  }
};
