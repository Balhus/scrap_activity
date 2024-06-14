import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tracking } from './tracking.model';

@Injectable()
export class TrackingService {
    constructor(
        @InjectModel(Tracking)
        private trackingModel: typeof Tracking
    ){}

    async createTracking(request_timestamp: Number, action: string, request_status: string, request_message: string): Promise<Tracking> {
        return this.trackingModel.create({ request_timestamp, action, request_status, request_message});
    }
    
    async findAll(): Promise<Tracking[]> {
        return this.trackingModel.findAll();
    }
}
