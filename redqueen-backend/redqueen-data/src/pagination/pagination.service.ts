import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class PaginationService {
  constructor(private readonly myDataSource: DataSource) {}

  public calcSkip(pageSize?: number, pageNumber?: number): number {
    return pageNumber && pageSize && pageSize > 0 && pageNumber > 0
      ? pageNumber * pageSize
      : 0;
  }

  public async getPaginationInfoFromQuery(
    queryString: string,
    pageSize?: number,
    pageNumber?: number,
  ): Promise<PaginationDto> {
    const rawResult = await this.myDataSource.transaction(
      async (transactionalEntityManager) => {
        const rawResults = (await transactionalEntityManager.query(
          queryString,
        )) as PaginationDto[];
        return rawResults;
      },
    );

    const paginationResult = rawResult[0];
    if (paginationResult) {
      const tempPageSize: number =
        pageSize && pageSize > 0
          ? parseInt(pageSize.toString())
          : paginationResult.recordCount;

      const tempPageNumber: number = pageNumber
        ? parseInt(pageNumber.toString())
        : 0;

      const totalPages: number =
        tempPageSize > 0 && paginationResult.recordCount > tempPageSize
          ? Math.ceil(paginationResult.recordCount / tempPageSize)
          : 1;

      paginationResult.pageSize = tempPageSize;
      paginationResult.pageNumber = tempPageNumber;
      paginationResult.totalPages = totalPages;
      return paginationResult;
    }

    return new PaginationDto(0, 0, 0, 0);
  }
}
