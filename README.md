# Fincript

A personal finance web application that puts user privacy first by using a fully encrypted data scheme. What this means is that even the website owner and database administrators cannot read your data, because it is encrypted and only you have the key to decrypt it.

#### The process works as outlined below:

1. Log in with an email and password, in the same way most sites work

2. Your encrypted user data is then downloaded from the server

3. Type your second password. This is your secret password

4. Your secret password gets transformed to your encryption/decryption key inside the browser

5. Your browser then applies your enc/dec key to the encrypted data, and thus makes it readable

6. Readable data is then loaded for you to view and manipulate
