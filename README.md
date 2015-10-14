# Smarter Email

**Smarter Email** is an Office Add-in built for Outlook that makes your email sound smarter by replacing words with high quality (read: long) synonyms. 

**Before using Smarter Email**
```
The quick brown fox jumped over the lazy dog.
```

**After using Smarter Email**
```
The straightaway chocolate-brown pull a fast one on participate terminated the faineant chase after.
```

## Required tools

* [npm](https://www.npmjs.com/)
* [Bower](http://bower.io/)
* [Gulp](http://gulpjs.com/)

## Get a Big Huge Thesaurus API key
1. Go to Big Huge Thesaurus' [website](https://words.bighugelabs.com/getkey.php).
2. Create an account and get an API key.
> Mention "Smarter Email" in your app's description.

## How to install

1. Clone this repository.
2. Set `apiKey` to the value of your API key in *appcompose/config.js*.
3. Run `npm install` to install both npm and Bower dependencies.
4. Run `gulp serve-static` to start development server.
5. Go to [mail.office365.com](http://mail.office365.com) and sign in with your Office 365 account.
6. Click the gear icon on the upper right, then choose *Manage add-ins*.
7. Click the plus icon, then choose *Add from a file*.
8. Browse to this repository folder and choose *manifest.xml*.
9. Then complete the wizard (*Next*, *Install*, *OK*) to make the Add-in available on your Office 365 account.

## How to run

1. After installing the Add-in, go to [mail.office365.com](mail.office365.com). 
2. Compose a new email.
3. Click *Add-ins* at the top of the window to see available Add-ins and choose **Smarter Email**.

## Helpful links

* [Yeoman generator](https://github.com/OfficeDev/generator-office) - Yeoman generator for building Microsoft Office related projects (including Add-ins). This project was built using it.
* [Office UI Fabric](https://github.com/OfficeDev/Office-UI-Fabric/) - The front-end framework for building experiences for Office 365. This project uses it to get an Office "look and feel". 
* [dev.office.com](http://dev.office.com) - Find documentation, samples, and other helpful information relevant to Office development.