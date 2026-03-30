import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../services/search.service';

@Controller('api/search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async search(@Query('q') keyword: string, @Query('limit') limit: number = 20) {
    if (!keyword || keyword.trim().length === 0) {
      return { news: [], announcements: [], keyword };
    }
    const results = await this.searchService.searchAll(keyword, limit);
    return { ...results, keyword };
  }

  @Get('news')
  async searchNews(
    @Query('q') keyword: string,
    @Query('limit') limit: number = 20,
  ) {
    if (!keyword || keyword.trim().length === 0) {
      return { data: [], keyword };
    }
    const data = await this.searchService.searchNews(keyword, limit);
    return { data, keyword };
  }

  @Get('announcements')
  async searchAnnouncements(
    @Query('q') keyword: string,
    @Query('limit') limit: number = 20,
  ) {
    if (!keyword || keyword.trim().length === 0) {
      return { data: [], keyword };
    }
    const data = await this.searchService.searchAnnouncements(keyword, limit);
    return { data, keyword };
  }
}
