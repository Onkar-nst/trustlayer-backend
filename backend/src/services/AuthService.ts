import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { DomainEvents, eventBus } from '../observers/EventBus';
import { LoginDTO, RegisterDTO, AuthResponse } from '../types/auth.types';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'super-refresh-secret-key';

export class AuthService {
  private userRepo = new UserRepository();

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw { status: 400, message: 'Email already registered' };
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.create({
      email: data.email,
      passwordHash,
      displayName: data.displayName,
    });

    eventBus.emitDomainEvent(DomainEvents.USER_REGISTERED, { userId: user.id, email: user.email });
    return this.generateTokens(user);
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw { status: 401, message: 'Invalid credentials' };
    }

    return this.generateTokens(user);
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET) as any;
      const user = await this.userRepo.findById(decoded.id);
      if (!user) throw new Error();
      return this.generateTokens(user);
    } catch {
      throw { status: 401, message: 'Invalid refresh token' };
    }
  }

  private generateTokens(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: '7d' });
    
    return { accessToken, refreshToken, user: { id: user.id, email: user.email, role: user.role, profile: user.profile } };
  }
}
