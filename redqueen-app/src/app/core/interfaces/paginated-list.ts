export interface PaginatedList<T> {
  pageSize: number;
  pageNumber: number;
  recordCount: number;
  totalPages: number;
  items: T[]
}
