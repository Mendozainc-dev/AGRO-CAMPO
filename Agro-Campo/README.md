# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Firebase

Copia `.env.example` como `.env.local` en esta carpeta y completa los valores
con el objeto `firebaseConfig` de la aplicación web del proyecto de Firebase.
Confirma que `EXPO_PUBLIC_FIRESTORE_DATABASE_ID` coincide con el identificador
de tu base en Firestore. Reinicia Expo después de cambiar estas variables.

En Firebase Authentication habilita **Correo electrónico/Contraseña**.
Para probar también Google en web, habilita **Google** y añade el dominio de
la aplicación web a los dominios autorizados de Authentication.

Para verificar la conexión en Expo Go, crea una cuenta de prueba, verifica su
correo e inicia sesión. El primer acceso con correo verificado crea el perfil
`usuarios/{uid}` como `tecnico` si el documento no existe. Un inicio de sesión
posterior lee el perfil existente. La app abre la pantalla de la bitácora después de cargar el perfil.

Las reglas de la base deben permitir a la persona autenticada y verificada
leer su propio documento y crearlo con su UID y correo del token y rol
`tecnico`. La asignación del rol `admin` debe quedar bajo control
administrativo. El proyecto móvil no despliega reglas ni cambia proveedores.
