export class apiFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery
    this.searchQuery = searchQuery
  }
  pagination() {
    if (this.searchQuery.page <= 0) this.searchQuery.page = 1
    let pageNumber = this.searchQuery.page * 1 || 1
    let pageLimit = this.searchQuery.size * 1 || 8
    let skip = (pageNumber - 1) * pageLimit
    this.pageNumber = pageNumber
    this.pageLimit = pageLimit
    this.mongooseQuery.skip(skip).limit(pageLimit)
    return this
  }
  filter() {
    let filterObj = { ...this.searchQuery }
    let excludedFields = ['page', 'sort', 'fields', 'keyword', 'size']
    excludedFields.forEach((val) => {
      delete filterObj[val]
    })
    filterObj = JSON.stringify(filterObj)
    filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, (match) => '$' + match)
    filterObj = JSON.parse(filterObj)
    if (Object.keys(filterObj).length > 0) {
      this.mongooseQuery.and([filterObj])
    }
    return this
  }
  sort() {
    if (this.searchQuery.sort) {
      let sortedBy = this.searchQuery.sort.split(',').join(' ')
      this.mongooseQuery.sort(sortedBy)
    }
    return this
  }
  fields() {
    if (this.searchQuery.fields) {
      let fields = this.searchQuery.fields.split(',').join(' ')
      this.mongooseQuery.select(fields)
    }
    return this
  }
  search() {
    if (this.searchQuery.keyword) {
      this.mongooseQuery.find({
        $or: [
          { title: { $regex: this.searchQuery.keyword } },
          { description: { $regex: this.searchQuery.keyword } },
        ],
      })
    }
    return this
  }
}
