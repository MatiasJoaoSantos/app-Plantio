Frontend - App Plantio (React Native com Expo)

Este diretório contém o código-fonte do aplicativo móvel para o projeto de Rastreabilidade de Plantio. O aplicativo foi desenvolvido utilizando React Native e o framework Expo para facilitar a configuração e o desenvolvimento multiplataforma.
Funcionalidades

    Listagem de Plantas: Tela inicial que exibe todas as plantas já registradas.

    Registro de Nova Planta: Um formulário para cadastrar uma nova planta, capturando seu nome, data de plantio e a geolocalização atual do dispositivo.

    Linha do Tempo de Cultivo: Visualização do histórico de uma planta específica, desde o plantio até as fases de irrigação, adubação e colheita.

    Adição de Novas Fases: Permite adicionar novos eventos (Irrigação, Adubação, Colheita) à linha do tempo de uma planta, registrando a geolocalização do momento.

Tecnologias e Bibliotecas

    React Native: Framework para desenvolvimento de aplicativos móveis nativos com JavaScript e React.

    Expo: Plataforma e conjunto de ferramentas que simplificam o desenvolvimento e a implantação de aplicativos React Native.

    Expo Location: Biblioteca para acessar a geolocalização do dispositivo.

    React Navigation: Para gerenciar a navegação entre as telas.

    Axios (implícito via fetch): Para realizar as chamadas HTTP para a API do backend.

Instalação e Execução
Pré-requisitos

    Node.js (versão LTS recomendada)

    NPM ou Yarn

    Expo Go instalado em seu dispositivo móvel (Android/iOS) ou um emulador/simulador configurado.

Passos para Instalação

    Clone o repositório (caso ainda não tenha feito):

    git clone <url-do-repositorio>
    cd app-plantio/frontend

    Instale as dependências:

    npm install

Executando o Aplicativo

    Inicie o Metro Bundler do Expo:

    npm start

    Após o bundler iniciar, um QR code será exibido no terminal.

        Para rodar em um dispositivo físico: Abra o aplicativo Expo Go e escaneie o QR code.

        Para rodar em um emulador/simulador: Pressione a para o emulador Android ou i para o simulador iOS no terminal onde o Metro está rodando.

Atenção: O aplicativo precisa se comunicar com a API do backend. Certifique-se de que o servidor backend esteja em execução e que o endereço da API no arquivo src/services/api.js esteja correto. Para testes em dispositivos físicos, substitua localhost pelo endereço IP da sua máquina na rede local.

Exemplo em src/services/api.js:

// Altere de:
const API_URL = 'http://localhost:5000/api';

// Para o IP da sua máquina (exemplo):
// const API_URL = '[http://192.168.1.10:5000/api](http://192.168.1.10:5000/api)';

Estrutura do Projeto

frontend/
|-- src/
|   |-- components/    # Componentes reutilizáveis (ícones, etc.)
|   |-- screens/       # Telas principais da aplicação
|   |   |-- PlantListScreen.js
|   |   |-- RegisterScreen.js
|   |   `-- TimelineScreen.js
|   |-- services/      # Lógica de comunicação com a API
|   |   `-- api.js
|   `-- App.js         # Componente raiz que gerencia o estado e a navegação
|
|-- assets/            # Imagens, fontes e outros recursos estáticos
|-- package.json       # Dependências e scripts do projeto
`-- app.json           # Configurações do projeto Expo

Decisões de Projeto

    React Native com Expo: A escolha pelo Expo foi motivada pela agilidade que ele proporciona. Ele abstrai muitas das complexidades de configuração de ambiente nativo, permitindo focar no desenvolvimento das funcionalidades. Isso é ideal para a prototipagem rápida exigida pelo desafio.

    Gerenciamento de Estado Simples: O estado global da aplicação (como qual tela exibir e os dados da planta ativa) é gerenciado no componente App.js e passado via props para as telas filhas. Para um protótipo com poucas telas, essa abordagem é mais simples e direta do que utilizar bibliotecas de gerenciamento de estado mais robustas como Redux ou Context API.

    Persistência Local Simples: O AsyncStorage é utilizado para armazenar o ID da planta ativa, permitindo que o usuário reabra o aplicativo e continue de onde parou.

Limitações e Melhorias Futuras

    Gerenciamento de Estado: Para uma aplicação maior, seria recomendado utilizar a Context API ou Zustand para um gerenciamento de estado mais escalável e evitar "prop drilling".

    UI/UX: A interface é funcional, mas poderia ser aprimorada com animações, transições mais suaves e um design system mais coeso.

    Tratamento de Erros: O tratamento de erros de rede é básico (usando Alert). Uma solução mais robusta incluiria componentes de feedback visual (como "toasts" ou "snackbars") e uma lógica de "retry" para chamadas de API que falharam.

    Componentização: Alguns componentes poderiam ser ainda mais divididos para aumentar a reutilização.