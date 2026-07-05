import { TJwtPayload } from "../modules/auth/auth.utils";

declare global {
  namespace Express {
    interface Request {
      user: TJwtPayload;
    }
  }
}

export { };