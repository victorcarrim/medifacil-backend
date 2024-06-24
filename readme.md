# MediFácil Backend


> Linha adicional de texto informativo sobre o que o projeto faz. Sua introdução deve ter cerca de 2 ou 3 linhas. Não exagere, as pessoas não vão ler.

### Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [] Desenvolvimento da funcionalidade de prontuarios de um paciente.
- [] Desevolvimento da integração com IA para auxilio ao profissional de saúde sobre o histórico médico de um paciente.
- [] Desenvolvimento da funcionalidade de familiares poderem acompanhar o tratamento de um paciente.

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você instalou a versão mais recente de `NodeJs`
- Você instalou a versão mais recente de `MongoDB`, ou configurou sua utilização na nuvem `MongoAtlas`
- Você possui o postman instalado, ou conta no postman web

## 🚀 Instalando MediFácil

Para instalar o MediFácil, siga estas etapas:

```
No arquivo .env, defina as seguintes variaveis:

MONGODB_URI: sua rota de conexão (local ou remota com o MongoAtlas) para o banco de dados MongoDB
SESSION_SECRET: sua chave secreta para a sessão da aplicação (você define)
JWT_SECRET: sua chave secreta para o token da aplicação (você define)
PORT: a porta em que a aplicação ira rodar

No arquivo importCsv, insira a URI do MongoDB no local indicado e rode o seguinte
comando para popular a base de dados com os medicamentos autorizados pela anvisa:

node importCsv.js

Para ter aceso as rotas de forma mais facil, importe o arquivo de configuração presente na pasta do Postman. A autenticação do sistema é realizada via Bearer Token
```

## ☕ Usando MediFácil

Para usar o MediFácil, siga estas etapas:

```
npm run dev
```

Usuários criados ao iniciar a aplicação

```
Usuário admin:
    - Login: 00000000000
    - Senha: 12345
    
Usuário profissional de saude:
    - Login: 11111111111
    - Senha: 12345
```

## 💻 Funcionalidades presentes no sistema

- Manter usuários:

    - Os usuários do sistema possuem 3 categorias específicas:
        - Admin: administrador do sistema.
        - Profhealth: profissional da saúde.
        - Cliente: clientes do sistema (pacientes).

    - Para a criação dos usuários, possuímos duas rotas:
        - Pré-Cadastro: é realizado um pré-cadastro com o nome, CPF e data de nascimento. Esse cadastro é feito pelos admins e profissionais de saúde, e o login no sistema pode ser feito apenas pelo QR Code presente na receita.

        - Cadastro Completo: utilizado para finalizar um pré-cadastro ou realizar um novo cadastro completo (dessa vez pelo usuário no aplicativo). Com o cadastro feito ou finalizado, poderá utilizar o login via CPF e senha.

    - O sistema comporta a listagem de usuários das três categorias, uma consulta a usuário específico e a alteração de usuários clientes para profissionais da saúde ou admins.

- Manter medicamentos:

    - Todos os medicamentos presentes no sistema são os disponibilizados pela Anvisa através dos dados abertos do sistema gov. A última atualização é de 2020, então novos medicamentos lançados após esse período não estão disponíveis.

    - O sistema permite consulta de todos os medicamentos presentes na base, consulta de um medicamento via nome ou via ID.

    - Os medicamentos presentes na base de dados são apenas os considerados válidos pela Anvisa.

- Manter receitas:

    - As receitas do sistema podem ser criadas apenas por usuários da categoria profissionais da saúde.

    - Para criar uma receita, deve conter as seguintes informações:
        - ID de identificação do paciente.
        - ID de identificação do profissional de saúde.
        - Data de validade da receita.
        - Foto do medicamento.
        - Array das informações dos medicamentos da receita, que deve incluir:
            - ID do medicamento.
            - Tempo de uso.
            - Intervalo de uso.
            - Quantidade de uso por dose.

    - Após a criação de uma nova receita, o sistema irá calcular automaticamente, com base no tempo de uso e no intervalo, quantas doses deverão ser tomadas.

    - Um PDF é gerado após a criação da receita, contendo as informações:
        - Nome do paciente.
        - Nome do profissional de saúde.
        - Informações sobre cada medicamento, que contém:
            - Nome e fabricante do medicamento.
            - Quantidade de uso por dose.
            - Intervalo de uso.
            - Tempo de uso.
        - Data em que a receita foi gerada.
        - QR Code com o login do usuário, para facilitar o acesso no aplicativo.

    - No aplicativo mobile, o usuário paciente tem em sua tela inicial todas as suas receitas ativas. Em cada receita, tem os medicamentos que deverão ser tomados, e um botão que sinaliza para o início do tratamento, onde o usuário paciente deve informar se foi tomado no momento em que clicou no botão ou anteriormente. Caso seja anteriormente, ele deverá informar a data e hora.

    - Com o início do tratamento do medicamento, o aplicativo mostra a data e hora de tomar a próxima dose, e três outros botões. O primeiro, se foi tomado na hora informada. O segundo, se foi tomado com atraso, onde deve informar a data e hora em que foi tomado. O terceiro é um botão de atualização da foto do medicamento, para o caso de não ter encontrado o especificado na receita e ter pego outro semelhante/genérico.

    - Ao final de cada tratamento, quando o usuário tomou todas as doses, a receita é finalizada automaticamente e deixa de estar disponível para o usuário pelo aplicativo.

    - Somente usuário do tipo cliente que pertence aquela receita pode iniciar um tratamento e registrar novas doses tomadas.


## 📫 Contribuindo para Medifácil

Para contribuir com MediFácil, siga estas etapas:

1. Bifurque este repositório.
2. Crie um branch: `git checkout -b <nome_branch>`.
3. Faça suas alterações e confirme-as: `git commit -m '<mensagem_commit>'`
4. Envie para o branch original: `git push origin medifacil-backend / <local>`
5. Crie a solicitação de pull.

Como alternativa, consulte a documentação do GitHub em [como criar uma solicitação pull](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

## 🤝 Colaboradores

Agradecemos às seguintes pessoas que contribuíram para este projeto:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/victorcarrim" title="Github Victor">
        <img src="https://avatars.githubusercontent.com/u/89991160?v=4" width="100px;" alt="Foto do Victor Ferrari"/><br>
        <sub>
          <b>Victor Ferrari</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/mayspiek" title="Github Mayara Spieker Carvalho">
        <img src="https://avatars.githubusercontent.com/u/79992764?v=4" width="100px;" alt="Foto da Mayara Spieker Carvalho"/><br>
        <sub>
          <b>Mayara Spieker Carvalho</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/gabrielamarqs" title="Github Gabriela Marques dos Santos">
        <img src="https://avatars.githubusercontent.com/u/106118943?v=4" width="100px;" alt="Foto da Gabriela Marques dos Santos"/><br>
        <sub>
          <b>Gabriela Marques dos Santos</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
