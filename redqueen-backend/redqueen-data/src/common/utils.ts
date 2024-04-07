export class Utils {
  public static isNullOrWhitespace(input?: string | null): boolean {
    return !input || input.match(/^ *$/) !== null;
  }
}
