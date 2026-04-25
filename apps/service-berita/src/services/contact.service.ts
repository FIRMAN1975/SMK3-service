import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact, ContactType } from '../entities/contact.entity';
import { CreateContactDto, UpdateContactDto } from '../dtos/contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create(createContactDto);
    return await this.contactRepository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: { isActive: true },
      order: { order: 'ASC' },
    });
  }

  async findByType(type: ContactType): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: { type, isActive: true },
      order: { order: 'ASC' },
    });
  }

  async findById(id: number): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException(`Kontak dengan ID ${id} tidak ditemukan`);
    }

    return contact;
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    const contact = await this.findById(id);
    Object.assign(contact, updateContactDto);
    return await this.contactRepository.save(contact);
  }

  async delete(id: number): Promise<void> {
    const contact = await this.findById(id);
    await this.contactRepository.remove(contact);
  }

  async toggleActive(id: number): Promise<Contact> {
    const contact = await this.findById(id);
    contact.isActive = !contact.isActive;
    return await this.contactRepository.save(contact);
  }
}
