export interface CreateReviewDTO {
  authorId: string;
  subjectId: string;
  transactionId: string;
  rating: number;
  body: string;
  isAnonymous?: boolean;
}

export interface ReviewResponse {
  id: string;
  authorId: string;
  subjectId: string;
  transactionId: string;
  rating: number;
  body: string;
  isAnonymous: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
