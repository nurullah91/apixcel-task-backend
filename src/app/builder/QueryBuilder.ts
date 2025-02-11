import { FilterQuery, Query } from "mongoose";

type TProductFilterQuery<T> = FilterQuery<T> & {
  category?: { $in?: string[] };
};
class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: "i" },
            } as FilterQuery<T>)
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query }; // Copy of query object

    // Exclude fields that are not for filtering
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Create a filter object
    const filterConditions: TProductFilterQuery<T> = {};

    if (queryObj.category) {
      filterConditions.category = { $in: queryObj.category as string[] };
    }
    this.modelQuery = this.modelQuery.find(filterConditions);

    return this;
  }

  sort() {
    const sortField = this.query.sort as string;
    if (sortField === "price") {
      // Sorting by upvote count for posts
      this.modelQuery = this.modelQuery.sort({ price: -1 });
    } else if (sortField === "discount") {
      // Sorting by upvote count for posts
      this.modelQuery = this.modelQuery.sort({ discount: -1 });
    } else {
      // Default sorting by creation date
      const sort = sortField?.split(",")?.join(" ") || "-createdAt";
      this.modelQuery = this.modelQuery.sort(sort as string);
    }

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  async countTotal() {
    const totalQueries = { ...this.modelQuery.getFilter() };
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
