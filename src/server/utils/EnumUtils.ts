
/**
 * Credit goes to [David Serret](http://stackoverflow.com/users/188246/david-sherret)
 */

export class EnumUtils {
  public static getNamesAndValues<T extends number>(e: any): {name: string, value: T}[] {
    return EnumUtils.getNames(e).map((n: string) => ({ name: n, value: e[n] as T }));
  }

  public static getNames(e: any): string[] {
    return EnumUtils.getObjValues(e).filter((v: any) => typeof v === 'string') as string[];
  }

  public static getValues<T extends number>(e: any): T[] {
    return EnumUtils.getObjValues(e).filter((v: any) => typeof v === 'number') as T[];
  }

  private static getObjValues(e: any): (number | string)[] {
    return Object.keys(e).map((k: any) => e[k]);
  }
}
