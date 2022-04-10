import { CreateUserDto, LoginUserDto } from '@dtos/users.dto';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { compare, hash } from 'bcrypt';

import { HttpException } from '@exceptions/HttpException';
import { SECRET_KEY } from '@config';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { sign } from 'jsonwebtoken';
import userModel from '@models/users.model';

class AuthService {
  public users = userModel;

  public async signup(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(400, `Your email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const avatar = `https://i.pravatar.cc/250?u=${userData.email}`;
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword, avatar });

    return createUserData;
  }

  public async login(userData: LoginUserDto): Promise<{ cookie: string; user: User }> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is empty');

    const findUser: User = await this.users.findOne({ email: userData.email }).select('+password');
    if (!findUser) throw new HttpException(404, `Your email ${userData.email} not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(400, 'Your password is not matching');

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, user: findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is empty');

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(404, `Your email ${userData.email} not found`);

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id, role: user.role };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60 * 1000;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
