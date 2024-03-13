import { BaseModel } from './model/base.model';
import { CountByModel } from './model/count-by.model';
import {
  Document,
  FilterQuery,
  Model,
  MongooseUpdateQueryOptions,
  PopulateOptions,
  QueryOptions,
} from 'mongoose';
import { PagingModel } from './model/paging.model';
import { PagingQueryModel } from './model/paging.query.model';
import { PagingWithoutFullSearchQueryModel } from './model/paging-without-full-search.query.model';
import { QueryModel } from './model/query.model';
import { SortBy, SortType } from './constants';
import {
  assignIn,
  cloneDeep,
  filter,
  find,
  forEach,
  isArray,
  isString,
  isUndefined,
  max,
  omitBy,
  split,
} from 'lodash';

export abstract class BaseRepository<DocType extends Document, ModelType extends BaseModel> {
  model: Model<DocType>;
  protected multiValueFields: string[];
  nullableFields: string[];
  sortBy: SortBy;
  sortType: SortType;
  protected textSearchFields: string[] = [];

  constructor() {
    this.multiValueFields = this.multiValueFields || [];
    this.nullableFields = this.nullableFields || [];
    this.sortBy = this.sortBy || SortBy.ID;
    this.sortType = this.sortType || SortType.DESC;
  }

  protected _remakeQuery(query: QueryModel | PagingQueryModel) {
    if (query.fullTextSearch) {
      query.$or = query.$or || [];
      query.$or.push(
        ...[
          {
            $text: { $search: `${query.fullTextSearch}` },
          },
          ...this.textSearchFields.map((field) => ({ [field]: new RegExp(query.fullTextSearch, 'i') })),
        ],
      );
    }

    if (query.createdAtFrom) {
      query['createdAt'] = { $gte: query.createdAtFrom };
    }

    if (query.createdAtTo) {
      query['createdAt'] = assignIn(query['createdAt'] || {}, { $lte: query.createdAtTo });
    }

    this.multiValueFields.forEach((field) => {
      if (field && query[field] && query[field]?.length) {
        query[field] = { $in: isArray(query[field]) ? query[field] : split(query[field], ',') };
      }
    });

    if (query.ids?.length) {
      const ids = query.ids.filter((id) => id);
      if (ids.length) {
        query['_id'] = {
          $in: ids,
        };
      }
    }
    query.sortBy = query.sortBy || this.sortBy;
    query.sortType = query.sortType || this.sortType;
    if (query.cursor) {
      query.page = 1;
      if (query.sortType === SortType.DESC) {
        if (query.includeCursor) {
          query[query.sortBy] = { $lte: query.cursor };
        } else {
          query[query.sortBy] = { $lt: query.cursor };
        }
      } else {
        if (query.includeCursor) {
          query[query.sortBy] = { $gte: query.cursor };
        } else {
          query[query.sortBy] = { $gt: query.cursor };
        }
      }
    }

    return omitBy(
      query,
      (value, key) =>
        isUndefined(value) ||
        value === '' ||
        (value === null && !this.nullableFields.includes(key)) ||
        [
          'fields',
          'externalFields',
          'fullTextSearch',
          'createdAtFrom',
          'createdAtTo',
          'page',
          'limit',
          'sortBy',
          'sortType',
          'ids',
          'cursor',
          'includeCursor',
        ].includes(key),
    ) as FilterQuery<DocType>;
  }

  convertFlatToStructure<T extends { parentId?: string; _id?: string; children?: T[] }>(
    records: T[],
    containParentId = true,
  ) {
    forEach(records, (x) => {
      const parent = find(records, (y) => y._id.toString() === x.parentId?.toString());
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(x);
      }
    });

    const flatResults = filter(records, (x) => !x.parentId);

    if (!containParentId) {
      const childrenResults = filter(records, (x) => !!x.parentId);
      forEach(childrenResults, (x) => {
        delete x.parentId;
      });
    }

    return flatResults;
  }

  async insert<T extends ModelType>(data: ModelType) {
    data.createdAt = data.updatedAt = Date.now();

    return (await this.model.create(data)).toJSON<T>() as T;
  }

  async insertMany<T extends ModelType>(items: ModelType[]) {
    if (!items.length) {
      return [];
    }
    const now = Date.now();
    items.forEach((data) => {
      data.createdAt = data.updatedAt = now;
    });
    const createdItems = await this.model.create(items);
    return createdItems.map((item) => item.toJSON<T>() as T);
  }

  async findById<T extends ModelType>(_id: string, fields: string[] = []) {
    if (!_id) return null;

    return this.model.findById(_id).select(fields).lean<T>().exec();
  }

  async findOne<T extends ModelType>(query = new QueryModel(), fields: string[] = []) {
    const newQuery = this._remakeQuery(query);
    fields = this.convertStringToArray(query.fields);

    return this.model.findOne(newQuery).select(fields).lean<T>().exec();
  }

  async findByIdAndUpdate<T extends ModelType>(id: string, data: any, options: QueryOptions = {}) {
    data.$setOnInsert = data.$setOnInsert || {};
    data.$setOnInsert = { ...data.$setOnInsert, createdAt: Date.now() };
    return this.model
      .findByIdAndUpdate(id, { ...data, updatedAt: Date.now() }, { new: true, ...options })
      .lean<T>();
  }

  async findOneAndUpdate<T extends ModelType>(query: QueryModel, data: any, options: QueryOptions = {}) {
    const newQuery = this._remakeQuery(query);
    data.$setOnInsert = data.$setOnInsert || {};
    data.$setOnInsert = { ...data.$setOnInsert, createdAt: Date.now() };
    return this.model
      .findOneAndUpdate(newQuery, { ...data, updatedAt: Date.now() }, { new: true, ...options })
      .lean<T>();
  }

  async findByIdAndDelete<T extends ModelType>(id: string) {
    return this.model.findByIdAndDelete(id).lean<T>();
  }

  async findOneAndDelete<T extends ModelType>(query: QueryModel) {
    const newQuery = this._remakeQuery(query);
    return this.model.findOneAndDelete(newQuery).lean<T>();
  }

  async findOrCreate<T extends ModelType>(query: any, data: ModelType) {
    const newQuery = this._remakeQuery(query);
    return (await this.findOne(newQuery)) || (await this.insert<T>(data));
  }

  async findAll<T extends ModelType>(query: QueryModel, fields: string[] = []) {
    const newQuery = this._remakeQuery(query);
    fields = this.convertStringToArray(fields);
    return this.model.find(newQuery, fields, null).sort(this.determineSort(query)).lean<T[]>().exec();
  }

  protected convertStringToArray(data: string | string[], separator = ',') {
    let returnValues: string[] = [];
    if (data) {
      if (isString(data)) {
        returnValues = split(data, separator);
      } else if (isArray(data)) {
        returnValues = data as string[];
      }
    }

    return returnValues;
  }

  protected convertArrayToObjectFields(items: string[]) {
    const data: { [key: string]: boolean } = {};
    items.forEach((item) => (data[item] = true));
    return data;
  }

  protected determineSort(query: QueryModel): any {
    if (query.fullTextSearch) return { score: { $meta: 'textScore' } };
    const sortBy = query.sortBy || this.sortBy;
    const sortType = query.sortType || this.sortType;
    return {
      [sortBy]: sortType === SortType.ASC ? 1 : -1,
    };
  }

  async paginate<T extends ModelType>(
    query: PagingQueryModel,
    options?: PopulateOptions | PopulateOptions[],
  ) {
    try {
      query = new PagingQueryModel(query);
      const fields = this.convertStringToArray(query.fields);
      const newQuery = this._remakeQuery(query);
      const data = await this.model
        .find(newQuery, fields)
        .populate(options)
        .sort(this.determineSort(query))
        .skip(max([0, (query.page - 1) * query.limit]))
        .limit(query.limit)
        .lean<T[]>()
        .exec();
      const total = await this.model.countDocuments(newQuery).exec();
      return new PagingModel<T>(data, total, query.page, query.limit);
    } catch (e) {
      return new PagingModel<T>([], 0, query.page, query.limit);
    }
  }

  async paginateAggregate<T>(query: PagingQueryModel, aggregations: any[] = [], flatField: string = null) {
    query = new PagingQueryModel(query);
    const fields = this.convertStringToArray(query.fields);
    const newQuery = this._remakeQuery(query);
    let formattedAggregations = [{ $match: newQuery }, ...aggregations];
    const formattedAggregationsCount = [...formattedAggregations, { $count: 'total' }];

    formattedAggregations.push({ $sort: this.determineSort(query) });
    if (fields && fields.length) {
      formattedAggregations = [...formattedAggregations, { $project: fields }];
    }

    const [data, count] = await Promise.all([
      this.model
        .aggregate(formattedAggregations)
        .skip(max([0, (query.page - 1) * query.limit]))
        .limit(query.limit)
        .exec(),
      this.model.aggregate(formattedAggregationsCount).exec(),
    ]);

    if (flatField) {
      forEach(data, (item) => {
        assignIn(item, item[flatField]);
        delete item[flatField];
      });
    }

    return new PagingModel<T>(data, count.length ? count[0].total : 0, query.page, query.limit);
  }

  async paginateAggregation<T>(
    pipelines: any[] = [],
    query: PagingQueryModel | PagingWithoutFullSearchQueryModel,
  ) {
    const pipelinesCount = cloneDeep(pipelines);
    pipelinesCount.push({ $count: 'total' });
    const fields = this.convertStringToArray(query.fields);
    pipelines.push({ $sort: this.determineSort(query) });
    if (fields && fields.length) {
      pipelines.push({ $project: this.convertArrayToObjectFields(fields) });
    }
    const [data, count] = await Promise.all([
      this.model
        .aggregate(pipelines)
        .skip(max([0, (query.page - 1) * query.limit]))
        .limit(query.limit)
        .exec(),
      this.model.aggregate(pipelinesCount).exec(),
    ]);

    return new PagingModel<T>(data, count.length ? count[0].total : 0, query.page, query.limit);
  }

  async updateOne(filter: any, data: any, options?: MongooseUpdateQueryOptions) {
    if (data.updatedAt === null) {
      delete data.updatedAt;
    } else {
      data.updatedAt = Date.now();
    }
    const result = await this.model.updateOne(filter, data, options).exec();

    return result.matchedCount > 0;
  }

  async updateMany(filter: any, data: any, options?: MongooseUpdateQueryOptions) {
    if (data.updatedAt === null) {
      delete data.updatedAt;
    } else {
      data.updatedAt = Date.now();
    }
    const result = await this.model.updateMany(filter, data, options).exec();

    return result.matchedCount > 0;
  }

  async deleteOne(conditions: any) {
    const result = await this.model.deleteOne(conditions).exec();
    return result.deletedCount > 0;
  }

  softDelete(id: string, options?: any) {
    return this.updateOne({ _id: id }, options);
  }

  softDeleteMany(ids: string[], options?: any) {
    return this.updateMany({ _id: { $in: ids } }, options);
  }

  async deleteMany(conditions: any) {
    const result = await this.model.deleteMany(conditions).exec();
    return result.deletedCount > 0;
  }

  async count(condition: any): Promise<number> {
    return (await this.model.countDocuments(this._remakeQuery(condition)).exec()) || 0;
  }

  async countBy(field: string, allValues: any[] = [], conditions: object = null): Promise<CountByModel[]> {
    const query = [];
    if (conditions) {
      query.push({ $match: this._remakeQuery(conditions) });
    }

    query.push({
      $group: {
        _id: `$${field}`,
        count: { $sum: 1 },
      },
    });
    const result = (await this.model.aggregate(query)) as CountByModel[];

    if (allValues && allValues.length > 0) {
      return allValues.map((value) => {
        const valueItem = result.find((x) => x._id === value);
        return valueItem || { _id: value, count: 0 };
      });
    }
    return result;
  }

  async estimatedCount() {
    return this.model.estimatedDocumentCount();
  }
}
