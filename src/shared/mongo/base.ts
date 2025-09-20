import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Document, FilterQuery, Types, ClientSession } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export type ID = Types.ObjectId | string;

export interface IPaginationMeta {
  total?: number;
  limit: number;
  page?: number;
  nextCursor?: string | null;
}

export interface IPagedResult<T> {
  data: T[];
  meta: IPaginationMeta;
}

export interface IListOptions {
  filter?: Record<string, any>;
  limit?: number;
  page?: number;
  sort?: Record<string, 1 | -1> | string;
  select?: string | string[];
  projection?: Record<string, 0 | 1>;
  cursor?: string;
  includeDeleted?: boolean;
}

export interface IAuditFields {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  createdBy?: ID | null;
  updatedBy?: ID | null;
}

@Injectable()
export class BaseRepository<TDocument extends Document & IAuditFields> {
  protected defaultLimit = 20;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(
    payload: Partial<TDocument>,
    session?: ClientSession,
  ): Promise<TDocument> {
    const doc = new this.model(payload);
    return session ? doc.save({ session }) : doc.save();
  }

  async insertMany(items: Partial<TDocument>[], session?: ClientSession) {
    return this.model.insertMany(items, { session });
  }

  buildBaseFilter(includeDeleted = false) {
    if (includeDeleted) return {};
    return { deletedAt: { $exists: false } } as any;
  }

  normalizeId(id: ID) {
    if (!id) return null;
    return Types.ObjectId.isValid(String(id))
      ? new Types.ObjectId(String(id))
      : id;
  }

  async findOne(
    filter: FilterQuery<TDocument>,
    opts?: { select?: string | string[]; includeDeleted?: boolean },
  ): Promise<TDocument | null> {
    const base = opts?.includeDeleted ? {} : this.buildBaseFilter(false);
    const merged = { ...base, ...filter } as FilterQuery<TDocument>;
    const q = this.model.findOne(merged);
    if (opts?.select) q.select(opts.select);

    return (await q.lean().exec()) as TDocument | null;
  }

  async findById(
    id: ID,
    opts?: { select?: string | string[]; includeDeleted?: boolean },
  ): Promise<TDocument | null> {
    const nid = this.normalizeId(id);
    if (!nid) return null;

    const base = opts?.includeDeleted ? {} : this.buildBaseFilter(false);
    const q = this.model.findOne({ ...base, _id: nid } as any);
    if (opts?.select) q.select(opts.select);

    return (await q.lean().exec()) as TDocument | null;
  }

  async list(options: IListOptions = {}): Promise<IPagedResult<TDocument>> {
    const limit = Math.max(
      1,
      Math.min(Number(options.limit ?? this.defaultLimit), 100),
    );
    const page = Number(options.page ?? 1);

    const baseFilter = options.includeDeleted
      ? {}
      : this.buildBaseFilter(false);
    const filter = {
      ...baseFilter,
      ...(options.filter ?? {}),
    } as FilterQuery<TDocument>;

    if (options.cursor) {
      const cursorId = this.normalizeId(options.cursor);
      Object.assign(filter, { _id: { $gt: cursorId } });
    }

    const query = this.model.find(filter);

    if (options.select) query.select(options.select as any);
    if (options.sort) query.sort(options.sort as any);
    else query.sort({ _id: 1 } as any);

    if (options.cursor) {
      query.limit(limit + 1);
      const docs = await query.lean().exec();
      const hasMore = docs.length > limit;
      const results = hasMore ? docs.slice(0, limit) : docs;
      const nextCursor = hasMore
        ? String((results[results.length - 1] as any)._id)
        : null;
      return {
        data: results as any,
        meta: { limit, nextCursor, page: undefined },
      };
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      query.skip(skip).limit(limit).lean().exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      data: data as any,
      meta: { total, limit, page },
    };
  }

  async updateById(
    id: ID,
    update: Partial<TDocument>,
    opts?: { session?: ClientSession; returnNew?: boolean },
  ) {
    const nid = this.normalizeId(id);
    if (!nid) throw new NotFoundException('Invalid id');

    const query = this.model.findOneAndUpdate(
      { _id: nid } as any,
      { $set: update } as any,
      {
        new: !!opts?.returnNew,
        session: opts?.session,
        runValidators: true,
      },
    );

    return query.exec();
  }

  async updateMany(
    filter: FilterQuery<TDocument>,
    update: Partial<TDocument>,
    opts?: { session?: ClientSession },
  ) {
    const base = this.buildBaseFilter(false);
    return this.model
      .updateMany({ ...base, ...filter } as any, { $set: update } as any, {
        session: opts?.session,
      })
      .exec();
  }

  async softDelete(id: ID, opts?: { session?: ClientSession; by?: ID }) {
    const nid = this.normalizeId(id);
    if (!nid) throw new NotFoundException('Invalid id');
    const update: any = { deletedAt: new Date() };
    if (opts?.by) update.updatedBy = opts.by;
    return this.model
      .findOneAndUpdate({ _id: nid } as any, { $set: update } as any, {
        new: true,
        session: opts?.session,
      })
      .exec();
  }

  async hardDelete(id: ID, opts?: { session?: ClientSession }) {
    const nid = this.normalizeId(id);
    if (!nid) throw new NotFoundException('Invalid id');
    return this.model.findByIdAndDelete(nid, { session: opts?.session }).exec();
  }

  async withTransaction<T>(
    callback: (session: ClientSession) => Promise<T>,
  ): Promise<T> {
    const session = await this.model.db.startSession();
    let result: T;
    await session.withTransaction(async () => {
      result = await callback(session);
    });
    session.endSession();
    //@ts-ignore
    return result;
  }

  async aggregate(pipeline: any[], opts?: { session?: ClientSession }) {
    const agg = this.model.aggregate(pipeline);
    if (opts?.session) agg.session(opts.session);
    return agg.exec();
  }

  async upsert(
    filter: FilterQuery<TDocument>,
    update: Partial<TDocument>,
    opts?: { session?: ClientSession },
  ) {
    return this.model
      .findOneAndUpdate(filter as any, { $set: update } as any, {
        upsert: true,
        new: true,
        session: opts?.session,
      })
      .exec();
  }

  async bulkWrite(
    ops: any[],
    opts?: { ordered?: boolean; session?: ClientSession },
  ) {
    return this.model.bulkWrite(ops, {
      ordered: opts?.ordered ?? false,
      session: opts?.session,
    });
  }
}

export const createBaseRepositoryProvider = <T extends Document & IAuditFields>(
  modelToken: string,
  model: Model<T>,
) => ({
  provide: `${modelToken}BaseRepository`,
  useFactory: () => new BaseRepository<T>(model),
});
