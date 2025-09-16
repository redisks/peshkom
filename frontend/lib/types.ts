export interface IPost {
  _id: string;
  date: string;
  title: string;
  text: string;
  image: string;
  likes: number;
  comments: IComment[];
  author: {
    id: number;
    name: string;
    email: string;
  };
  route: {
    places: IPlace[];
  }
}

export interface IComment {
  author: string;
  text: string;
}

export interface IPlace {
  _id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  address: string;
  tags: string[];
  rating: number;
  reviews: {
    author: string;
    date: string;
    rating: number;
    text: string;
  }[];
  image: string;
}
