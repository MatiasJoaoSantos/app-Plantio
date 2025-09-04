import { registerRootComponent } from 'expo';
import App from './src/App'; // Ajuste o caminho se o seu App.js estiver em outro lugar

// registerRootComponent chama AppRegistry.registerComponent('main', () => App);
// e garante que tudo funcione bem com as ferramentas do Expo.
registerRootComponent(App);
