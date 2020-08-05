const config = {
    port: '3000',
    session: {
        name: 'SongTang',
        secret: 'SongTang',
        cookie: {
            httpOnly: true,
            secure:   false,
            maxAge:    60 * 1000,
        }
    }
};
const secretKey = 'Guadalcanal_SongTang._07_qvj'; // token key
module.exports = {config, secretKey};
