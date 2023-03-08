# webapp-security-scanner

This is a RESTful API that provides various cybersecurity services and features for users. The API is built with Node.js, Express.js, and MongoDB. It uses JSON Web Tokens (JWT) for authentication and authorization, and has several routes for different cybersecurity services.

# Getting started

To get started with this API, follow these steps:

Clone this repository to your local machine.
Install the required dependencies by running npm install in the terminal.
Set up a MongoDB database and configure the MONGO_URI environment variable in the .env file.
Set up a secret key for JWT token in the .env file as well.
Start the server by running npm start in the terminal.
Routes

# The API has the following routes:

#Authentication Routes

<strong>/register</strong>
This route allows users to create a new account by providing their email, password, and name.

<strong>/login</strong>
This route allows users to log in by providing their email and password. A JWT token is returned upon successful login.

<strong>/forgot-password</strong>
This route allows users to request a password reset by providing their email. A password reset link is sent to the user's email.

<strong>/reset-password</strong>
This route allows users to reset their password by providing their email, new password, and a password reset token received in their email.

# Security Routes

<strong>/scan</strong>
This route performs a security scan on a specified URL using OWASP ZAP and returns the scan results.


<strong>/threat-intelligence</strong>
This route provides threat intelligence information for a specified IP address or domain.


<strong>/firewall-management</strong>
This route allows users to manage their firewall rules by adding, editing, and deleting rules.

#

# Monitoring Routes

<strong>/log-monitoring</strong>
This route allows users to view and filter their server logs.

#

# Incident Response Routes
<strong>/incident-response</strong>
This route provides guidance and support for users who have experienced a cybersecurity incident, such as a data breach or malware attack.
#
Authentication and Authorization
JWT is used for authentication and authorization in this API. Upon successful login, a JWT token is generated and sent back to the user. This token must be included in the headers of subsequent requests for protected routes.

# Conclusion

This API provides various cybersecurity services and features for users, including authentication, security scanning, threat intelligence, firewall management, log monitoring, and incident response. It can be easily customized and extended to fit the needs of different applications and organizations.
