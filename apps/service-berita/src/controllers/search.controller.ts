import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly service: SearchService) {}

  @Get()
  async search(@Query('q') keyword: string, @Query('limit') limit = 20) {
    if (!keyword?.trim()) {
      return { news: [], announcements: [], keyword };
    }
    return await this.service.searchAll(keyword, limit);
  }
}