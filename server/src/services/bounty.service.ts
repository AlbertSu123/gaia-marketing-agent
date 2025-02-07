import { BaseService } from './base.service';
import { FastifyInstance } from 'fastify';
import axios from 'axios';

interface Bounty {
  id: string;
  title: string;
  description: string;
  value: number;
  bountyScore: number;
  creatingUsername: string;
  fillingUserId?: string;
  filled?: Date;
  tweetId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BountyService extends BaseService {
  private apiBaseUrl: string;

  constructor(app: FastifyInstance) {
    super(app);
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  }

  async fetchAvailableBounties(): Promise<Bounty[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/bounties`, {
        params: {
          filled: false
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bounties:', error);
      return [];
    }
  }

  async postBounty(bountyData: Partial<Bounty>): Promise<Bounty | null> {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/bounties`, bountyData);
      return response.data;
    } catch (error) {
      console.error('Error posting bounty:', error);
      return null;
    }
  }

  async updateBounty(bountyId: string, updateData: Partial<Bounty>): Promise<Bounty | null> {
    try {
      const response = await axios.patch(`${this.apiBaseUrl}/bounties/${bountyId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating bounty:', error);
      return null;
    }
  }

  async getBountyById(bountyId: string): Promise<Bounty | null> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/bounties/${bountyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bounty:', error);
      return null;
    }
  }
}
