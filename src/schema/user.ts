import gql from 'graphql-tag';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    id: string;
    firstname: string;
    lastname: string;
    phone: string;
}

export const UserSchema = gql`
    type User {
        id: ID!
        firstname: String!
        lastname: String!
        phone: String!
    }
`;

export const UserDocument = new Schema({
    firstname: {
        index: true,
        required: true,
        type: String
    },
    lastname: {
        required: true,
        type: String
    },
    phone: {
        match: /^\+\d{1,3}\s\d{1,3}\s\d{4,5}\-\d{4}$/,
        required: true,
        type: String
    }
}, { validateBeforeSave: true, timestamps: true, collection: 'user' });

export default mongoose.model<IUser>('User', UserDocument);
