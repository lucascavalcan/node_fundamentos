// banco de dados "fictício"
// arquivo json que vai ser populado por um comando na aplicação
import fs from 'node:fs/promises'
// para trabalhar com arquivos físicos no node, é necessário usar esse módulo interno


// o node sempre considera o local onde a aplicação está sendo executada como o local onde os arquivos vão ser criados
// import.meta.url --> caminho para o arquivo database
const databasePath = new URL('../db.json', import.meta.url) // URL (classe interna do node) --> recebe dois parametros - nome do arquivo que quer no final ('db.json') e caminho relativo onde quer criar o arquivo (import.meta.url)

export class Database {
    // banco de dados genérico (vai poder salvar qualquer tipo de info e não apenas usuários)
    #database = {}
    // # serve para não deixar a variável ser acessada por arquivos externos (se torna uma propriedade privada)

    
    #persist() { // esse método é o que vai escrever o BD em um arquivo físico
        fs.writeFile(databasePath, JSON.stringify(this.#database)) // stringfy para converter o BD em uma estrutura json
    }

    select(table) {  // esse método vai receber a tabela que quer selecionar --> para poder retornar todos os dados contidos na tabela
        const data = this.#database[table] ?? [] // se não existir table dentro de database, vai retornar um array[] vazio

        return data
    }

    insert(table, data) { // esse método vai receber a tabela do BD quer fazer a inserção (table) e os dados (data) que vão ser inseridos 
        // vai verificar se já existe algum registro naquela tabela, caso exista vai adicionar, se não, vai ter que criar um array
        if(Array.isArray(this.#database[table])) { // se já existe um array nessa tabela:
            this.#database[table].push(data) // vai pegar a tabela e adicionar um novo item (push) (que está vindo de dentro de data) lá dentro
        } else {
            this.#database[table] = [data] // caso contrário, vai se criar um novo array com o item la dentro
        }

        this.#persist(); // esse método #persist vai ser chamado toda vez que se inserir alguma info no BD (para que sempre que inserir uma nova info, salvar isso dentro dos arquivos físicos)

        return data;
    }
}