import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OpenLibraryClientService } from '../open-library/open-library-client.service';
import { Book } from './books.entity';

@Injectable()
export class BooksService {
  readonly DEFAULT_RELATIONS = ['authors'];

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    private readonly openLibraryClientService: OpenLibraryClientService,
  ) {}

  findAll(): Promise<Book[]> {
    return this.bookRepository.find({ relations: this.DEFAULT_RELATIONS });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({
      relations: this.DEFAULT_RELATIONS,
      where: { id },
    });

    if (!book) throw new NotFoundException(`Book with id ${id} not found.`);

    return book;
  }

  async updateAllBooksWithYear(): Promise<{ updated: number; errors: number }> {
    const books = await this.bookRepository.find();
    let updated = 0;
    let errors = 0;

    for (const book of books) {
      try {
        const bookDetails = await this.openLibraryClientService.getBookDetails(
          book.workId,
        );

        if (bookDetails?.first_publish_date) {
          const year = this.extractYearFromDate(bookDetails.first_publish_date);

          if (year) {
            book.year = year;
            await this.bookRepository.save(book);
            updated++;
          } else {
            errors++;
          }
        } else {
          errors++;
        }
      } catch (error) {
        console.error(`Error updating book ${book.id}:`, error.message);
        errors++;
      }
    }

    return { updated, errors };
  }

  private extractYearFromDate(dateString: string): number | null {
    const yearRegex = /\b(19|20)\d{2}\b/;
    const yearMatch = yearRegex.exec(dateString);
    return yearMatch ? parseInt(yearMatch[0], 10) : null;
  }
}
