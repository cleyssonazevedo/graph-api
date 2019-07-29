import gql from 'graphql-tag';
import User, { IUser, UserDocument } from '../schema/user';
import { PubSub } from 'graphql-yoga';

export const UserResolver = {
    Mutation: {
        createUser(_: any, { firstname, lastname, phone }: IUser) {
            return User.create({ firstname, lastname, phone })
                .catch((err) => ({
                    tecnicalMessage: err.message || 'Erro não especificado',
                    businessMessage: 'Falha ao inserir usuário'
                }));
        }
    },
    Query: {
        user: ({ id }: {  id: string }) => User.findById(id).exec(),
        users: () => User.find().exec(),
    },
    Subscription: {
        /**
         * O retorno do WebSocket precisa ter o nome da função
         */
        newUser: {
            async subscribe(_: any, __: any, { pubsub }: { pubsub: PubSub }) {
                const channel = Math.random().toString(36).substring(2, 15); // random channel name
                let count = 0;
                await new Promise((resolve) => {
                    setInterval(() => {
                        pubsub.publish(channel, { newUser: {
                            id: (count++).toString(),
                            message: 'User add',
                            date: new Date().toISOString()
                        }});
                        resolve();
                    }, 2000);
                });

                return pubsub.asyncIterator(channel);
            }
        }
    }
};

export const UserResolverSchema = gql`
    type NewUser {
        id: String!
        message: String!
        date: String!
    }

    extend type Query {
        users: [User!]!
        user(id: ID!): User!
    }

    extend type Mutation {
        createUser(firstname: String!, lastname: String!, phone: String!): User
    }

    extend type Subscription {
        newUser: NewUser!
    }
`;
