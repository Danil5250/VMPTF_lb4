import type { JwtPayload } from '../modules/clients/types'; // or remove if not needed

declare global {
    namespace Express {
        export interface Request {
            user?: any;
        }
    }
}
