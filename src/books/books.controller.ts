import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { Book } from './books.entity';
import { BooksService } from './books.service';
import { QueryBooksSchema } from './dto/query-books.dto';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Patch('update-all-with-year')
  updateAllWithYear() {
    return this.booksService.updateAllBooksWithYear();
  }

  @Get('query/:country')
  findBooksByAuthorCountry(
    @Param('country') country: string,
    @Query('from') from?: string,
  ): Promise<Book[]> {
    if (!country || country.trim() === '') {
      throw new BadRequestException('Country parameter is required');
    }

    const validation = QueryBooksSchema.safeParse({ country, from });

    if (!validation.success) {
      throw new BadRequestException(validation.error.issues[0].message);
    }

    const fromYear = from ? parseInt(from, 10) : undefined;

    return this.booksService.findBooksByAuthorCountry(country, fromYear);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }
}
