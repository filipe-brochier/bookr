import { Model, Types, QueryFilter, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {
    /* */
  }

  protected toObjectId(id: string): Types.ObjectId {
    return new Types.ObjectId(id);
  }

  protected processFilterQuery(
    filterQuery: QueryFilter<TDocument>,
  ): QueryFilter<TDocument> {
    if (filterQuery._id && typeof filterQuery._id === 'string') {
      return {
        ...filterQuery,
        _id: this.toObjectId(filterQuery._id),
      };
    }
    return filterQuery;
  }

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    const result = await createdDocument.save();

    const json = result.toJSON() as unknown as TDocument;

    return json;
  }

  async findOne(filterQuery: QueryFilter<TDocument>): Promise<TDocument> {
    const processedFilterQuery = this.processFilterQuery(filterQuery);

    const document = await this.model
      .findOne(processedFilterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        `Document not found with filterQuery: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: QueryFilter<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const processedFilterQuery = this.processFilterQuery(filterQuery);

    const document = await this.model
      .findOneAndUpdate(processedFilterQuery, update, { new: true })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        `Document not found with filterQuery: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async find(filterQuery: QueryFilter<TDocument>): Promise<TDocument[]> {
    const processedFilterQuery = this.processFilterQuery(filterQuery);

    const documents = await this.model
      .find(processedFilterQuery)
      .lean<TDocument[]>(true);

    return documents;
  }

  async findOneAndDelete(
    filterQuery: QueryFilter<TDocument>,
  ): Promise<TDocument> {
    const processedFilterQuery = this.processFilterQuery(filterQuery);

    const document = await this.model
      .findOneAndDelete(processedFilterQuery)
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn(
        `Document not found with filterQuery: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Document not found');
    }

    return document;
  }
}
