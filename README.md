# MeetApp Server
Agregador de eventos para desenvolvedores


### Para rodar o projeto:

_Sete as configurações da base de dados no arquivo src/config/database.js_

_OPCIONAL: Para criar uma instância do postgres com o docker em sua máquina_

**docker run --name database-pg -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres**

_Para baixar as dependências_

**yarn**

_Para iniciar a aplicação_

**yarn dev**


### Sopinha de Letrinhas

**Sequelize** como ORM do App

**express e jsonwebtoken** para lidar com requisições HTTP (Rest + JWT)

**bcryptjs** para hash do password do usuário

**YUP** para lidar com as validações das requisições HTTP

**multer** para lidar com multipart/form-data

**mongoose** ODM MongoDB

**nodemailer + handlerbars** para envio de e-mails

**bee-queue** para lidar com filas - envio de emails

**ioredis** para lidar com Redis e realizar _cache_ para algumas consultas na base de dados



__Você pode se interessar pelos clientes Web e Mobile:__ <br />
_[MeetApp Mobile](https://github.com/mayconfrancisco/meetapp-mobile) versão móvel (Android/iOS - ReactNative) do MeetApp_<br />
_[MeetApp Web](https://github.com/mayconfrancisco/meetapp-web) versão web (ReactJS) do MeetApp_
