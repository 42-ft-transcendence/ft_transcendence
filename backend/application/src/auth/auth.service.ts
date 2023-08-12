import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(fourtyTwoId: number) {
        const user = await this.usersService.findOneByFourtyTwoId(fourtyTwoId);

        if (!user) {
            return null;
        }
        return user;
    }
}
