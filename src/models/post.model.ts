import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface PostInput {
  userId: string;
  location: {
    lat: string;
    lon: string;
    address: string;
  };
  category: {
    position: number;
    cat_id: string;
    cat_image: string;
    cat_name: string;
    cat_icon: string;
  };
  images: string[];
  title: string;
  price: string;
  status: {
    name: string;
    id: string;
    name_en: string;
    description: string;
  };
  description: string;
  phone: string;
}

export interface PostDocument extends PostInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    location: { type: Object, required: true },
    category: { type: Object, required: true },
    images: [{ type: String, required: true }],
    title: { type: String, required: true },
    price: { type: String, required: true },
    status: { type: Object, required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

PostSchema.plugin(mongoosePaginate);

const PostModel = mongoose.model<
  PostDocument,
  mongoose.PaginateModel<PostDocument>
>("Post", PostSchema);

export default PostModel;
