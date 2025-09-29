import bcrypt from 'bcrypt';

const saltRounds = 10;

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password,salt);
};

export const compareHashed = (plain,hashed) => bcrypt.compareSync(plain,hashed);

export default hashPassword;