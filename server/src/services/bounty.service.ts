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
  status?: string;
  tags?: string[];
  requirements?: string;
  deadline?: Date;
}

export class BountyService extends BaseService {
  private apiBaseUrl: string;
  private lastFetchTime: number = 0;
  private readonly FETCH_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown

  constructor(app: FastifyInstance) {
    super(app);
    this.apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
  }

  async fetchAvailableBounties(): Promise<Bounty[]> {
    try {
      // Check if we're within the cooldown period
      const now = Date.now();
      if (now - this.lastFetchTime < this.FETCH_COOLDOWN) {
        console.log('Skipping bounty fetch due to cooldown');
        return [];
      }

      this.lastFetchTime = now;

      const response = await axios.get(`${this.apiBaseUrl}/bounties`, {
        params: {
          filled: false,
          status: 'active'
        }
      });

      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response format from bounty API');
        return [];
      }

      // Filter out bounties that don't meet minimum requirements
      return response.data.filter(bounty =>
        bounty.title &&
        bounty.description &&
        bounty.value > 0 &&
        (!bounty.deadline || new Date(bounty.deadline) > new Date())
      );
    } catch (error) {
      console.error('Error fetching bounties:', error);
      return [];
    }
  }

  async postBounty(bountyData: Partial<Bounty>): Promise<Bounty | null> {
    try {
      // Validate required fields
      if (!bountyData.title || !bountyData.description || !bountyData.value) {
        throw new Error('Missing required bounty fields');
      }

      const response = await axios.post(`${this.apiBaseUrl}/bounties`, {
        ...bountyData,
        status: bountyData.status || 'active',
        createdAt: new Date().toISOString()
      });

      return response.data;
    } catch (error) {
      console.error('Error posting bounty:', error);
      return null;
    }
  }

  async updateBounty(bountyId: string, updateData: Partial<Bounty>): Promise<Bounty | null> {
    try {
      if (!bountyId) {
        throw new Error('Bounty ID is required');
      }

      const response = await axios.patch(`${this.apiBaseUrl}/bounties/${bountyId}`, {
        ...updateData,
        updatedAt: new Date().toISOString()
      });

      return response.data;
    } catch (error) {
      console.error('Error updating bounty:', error);
      return null;
    }
  }

  async getBountyById(bountyId: string): Promise<Bounty | null> {
    try {
      if (!bountyId) {
        throw new Error('Bounty ID is required');
      }

      const response = await axios.get(`${this.apiBaseUrl}/bounties/${bountyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bounty:', error);
      return null;
    }
  }

  async markBountyAsFilled(bountyId: string, fillingUserId: string): Promise<Bounty | null> {
    try {
      return await this.updateBounty(bountyId, {
        fillingUserId,
        filled: new Date(),
        status: 'filled'
      });
    } catch (error) {
      console.error('Error marking bounty as filled:', error);
      return null;
    }
  }

  async getUnpostedBounties(): Promise<Bounty[]> {
    try {
      const bounties = await this.fetchAvailableBounties();
      return bounties.filter(bounty => !bounty.tweetId);
    } catch (error) {
      console.error('Error getting unposted bounties:', error);
      return [];
    }
  }
}
