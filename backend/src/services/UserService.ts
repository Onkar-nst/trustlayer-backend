import { UserRepository } from '../repositories/UserRepository';
import { ReviewRepository } from '../repositories/ReviewRepository';

export class UserService {
  private userRepo = new UserRepository();
  private reviewRepo = new ReviewRepository();

  async getProfile(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw { status: 404, message: 'User not found' };
    
    const reviews = await this.reviewRepo.findByUser(id);
    const averageRating = reviews.length > 0 
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
      : 0;

    return {
      ...user,
      reviewSummary: {
        count: reviews.length,
        averageRating
      }
    };
  }

  async search(query: string) {
    return this.userRepo.searchPublic(query);
  }

  async getAll(skip?: number, take?: number) {
    return this.userRepo.findAll(skip, take);
  }
}
