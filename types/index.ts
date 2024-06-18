export interface trainingType {
  id: number;
  title: string;
  image: string;
  description: string;
}

export interface FormError {
  email: string;
  password: string;
}

export interface UserType {
  id: number;
  email: string;
  password: string;
}
