const prod: string = 'http://localhost:3000/home';
const dev: string = 'http://localhost:3000/home';
const endpoint = process.env.NODE_ENV === 'production' ? prod : dev;
export const Auth0Config = {
    domain: 'dev-xzmvmjtq.us.auth0.com',
    clientId: 'LJ5icuPMWoAHbf87GHRvxTtLyCHuqr9m',
    redirectUri: endpoint,
    audience: 'http://localhost:4000',
    scope: 'read:current_user update:current_user_metadata',
};
