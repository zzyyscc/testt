//banner数据类型
export type Banner = {
  banId: string,
  goodsId?: string,
  title?: string,
  images?: string,
  status?: string,
  orderNum?: string
}

export type BannerListParm = {
  currentPage: number,
  pageSize: number,
  goodsName: string,
  total?: number
}
