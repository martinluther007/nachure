export default class ApiFeatures {
  length: any;
  constructor(public query: any, private queryString: any) {}
  public filtering() {
    const queryObj = { ...this.queryString };
    //exclude fields from query while filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // advanced filtering for $gte $lte type queries
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|lt|gte|lte)\b/g,
      (matched: string) => `$${matched}`
    );
    this.query.find(JSON.parse(queryString));
    return this;
  }
  public sorting() {
    if (this.queryString.sort) {
      // the + sign adds white space without the code
      // @ts-ignore
      this.query = this.query.sort(this.queryString.sort);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  public limitFields() {
    if (this.queryString.fields) {
      // @ts-ignore
      this.query = this.query.select(this.queryString.fields);
    }
    return this;
  }

  public paginate() {
    const limit = this.queryString.limit * 1 || 5; //   @ts-ignore
    const page = this.queryString.page * 1 || 1;
    //   @ts-ignore
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
