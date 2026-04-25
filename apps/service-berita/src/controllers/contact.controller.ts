import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ContactService } from '../services/contact.service';
import { CreateContactDto, UpdateContactDto } from '../dtos/contact.dto';
import { ContactType } from '../entities/contact.entity';

@Controller('api/contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createContactDto: CreateContactDto) {
    return await this.contactService.create(createContactDto);
  }

  @Get()
  async findAll() {
    return await this.contactService.findAll();
  }

  @Get('type/:type')
  async findByType(@Param('type') type: ContactType) {
    return await this.contactService.findByType(type);
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    return await this.contactService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return await this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: number) {
    await this.contactService.delete(id);
  }

  @Put(':id/toggle-active')
  async toggleActive(@Param('id') id: number) {
    return await this.contactService.toggleActive(id);
  }
}
