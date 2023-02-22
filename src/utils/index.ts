export interface EnumerateData<T = string> {
  value: T
  label: string
}
export class Enumerate<T = string> {
  private readonly data: EnumerateData<T>[]
  constructor(datos: EnumerateData<T>[]) {
    this.data = datos
  }
  getEnum() {
    return this.data.map((x) => x.value)
  }
  getData() {
    return this.data
  }
}
