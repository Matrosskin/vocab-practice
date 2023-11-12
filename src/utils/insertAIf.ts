export const insertAIf = <T>(condition: boolean, ...values: T[]): T[] => (condition ? values : [])
