import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OpenLibraryClientService {
  constructor(private readonly httpService: HttpService) {}

  async getBookDetails(
    workId: string,
  ): Promise<{ first_publish_date?: string } | null> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`https://openlibrary.org/works/${workId}.json`),
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching book details for workId ${workId}:`,
        error.message,
      );
      return null;
    }
  }
}
