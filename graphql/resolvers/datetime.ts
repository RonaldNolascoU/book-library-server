import { Kind, GraphQLScalarType } from 'graphql'

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime Scaler Type',
  serialize(value: any) {
    return new Date(value).toISOString()
  },
  parseValue(value: any) {
    return new Date(value)
  },
  parseLiteral(ast: any) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10))
    }
    return null
  }
})

export default DateTimeScalar
