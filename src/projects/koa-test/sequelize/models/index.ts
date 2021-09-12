import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table
export class Author extends Model {
  @Column
  firstName: string;
  @Column
  lastName: string;
  @Column
  middleName: string;
  @Column
  birthDate: string;
}

@Table
export class Book extends Model {
  @Column
  name: string;
  @Column
  publicationYear: number;
  @ForeignKey(() => Author)
  @Column
  authorId: number;
  @BelongsTo(() => Author)
  author: Author;
}
