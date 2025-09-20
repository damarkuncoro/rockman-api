// core/repo/repo.types.ts
export type RepoGenerics<
  TSelect,
  TCreate = Partial<TSelect>,
  TReturn = TSelect,
  TUpdate = Partial<TSelect>,
  TDelete = Partial<TSelect>
> = {
  TSelect: TSelect
  TCreate: TCreate
  TReturn: TReturn
  TUpdate: TUpdate
  TDelete: TDelete
}
