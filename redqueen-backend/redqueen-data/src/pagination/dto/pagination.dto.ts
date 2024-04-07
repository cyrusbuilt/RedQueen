import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  constructor(
    pageSize: number,
    pageNumber: number,
    recordCount: number,
    totalPages: number,
  ) {
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
    this.recordCount = recordCount;
    this.totalPages = totalPages;
  }

  @ApiProperty({
    description: 'The number of records per page',
    example: '10',
  })
  pageSize: number;

  @ApiProperty({
    description: 'The current page',
    example: '1',
  })
  pageNumber: number;

  @ApiProperty({
    description: 'The total number of records available',
    example: '20',
  })
  recordCount: number;

  @ApiProperty({
    description: 'The total number of pages of records',
    example: '2',
  })
  totalPages: number;
}
