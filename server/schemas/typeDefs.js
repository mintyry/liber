const gql = String.raw

const typeDefs = gql`

type User {
    _id: ID
    username: String
    email: String
    role: String
    keptBooks: [Book]
}

type Author {
    _id: ID
    name: String
}

type Comments {
    _id: ID
    userId: ID
    comments: String
}

# image in type Book must be the same data type as in model; it is not a string. it is an object containing strings.
# had to make a new type for Image, because inline objects in GraphQL have to be named, and they cannot name them within a type's object.
type Image {
    data: String
    contentType: String
}

type Book {
    # unsure if id will need to be a different property
    _id: ID
    title: String
    bookId: String
    authors: [Author]
    image: Image
    text: String
    reviews: [Review]
}


type Review {
    _id: ID
    comments: [Comments]
    rating: Int
    userId: User
}

type Auth {
    token: ID!
    user: User
}

type Query {
    myLibrary: User
    getBooks: [Book]
    getSingleBook(_id: ID!): Book
}

input KeepBookInput {
    _id: ID
    title: String
    authors: [String]
    image: String
    text: String
    bookId: String
}

type Mutation {
    login(email: String!, password: String!): Auth
    createUser(username: String!, email: String!, password: String!): Auth
    keepBook(input: KeepBookInput!): User
    removeBook(_id: ID): User
    addReview(bookId: ID!, comments: String!, rating: Int!): Book
}

`;

module.exports = typeDefs;