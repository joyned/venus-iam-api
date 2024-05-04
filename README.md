# Venus IAM

Venus IAM is all-in-one IAM system to help you in your applications. 

It provides:
- Role management;
- Groups associted with roles;
- Users with groups;
- Client registration;
- Custom login page for your applications;
- And more.

You can use either for APIs authentication (`OAuth2`) or for users authentication.

It is highly configurable to match all your requirements.

# Technical Informations

This project uses NodeJS and Express to build an efficient API.

### Using with Docker

You can use Venus IAM with Docker. To run, you can follow this command:

```
docker run -p 3000:3000 -p 9000:9000 \
-e REQUEST_MAX_SIZE=5mb \
-e JWT_SECRET=<A SECRET FOR TOKEN SIGN> \
-e ADMIN_USER_EMAIL=<AN EMAIL TO CREATE ADMIN USER> \
-e ADMIN_USER_PASSWORD=<A PASSWORD FOR ADMIN USER> \
joyned/venus-iam:latest
```