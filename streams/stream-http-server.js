import http from 'node:http'
import {Transform} from 'node:stream'

class InverseNumberStream extends Transform {
    //stream que vai transformar todo numero em negativo
    _transform(chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1
        console.log(transformed)
        callback(null, Buffer.from(String(transformed))) // o 1º parametro do callback é o erro (null) é o sucesso (o numero transformado - transformed)
    }
}

// TUDO no node são streams
// req - readable stream
// res - writable stram

const server = http.createServer(async (req, res)=> { 

    // quando eu preciso de uma informação POR COMPLETO para só então poder trabalhar com esses dados
    // isso é muito util, por exemplo, com jsons (pois eles não podem ser consumidos antes de estarem completos)
    // cria-se um array de buffers ("pedaços" que vão sendo recebidos da stream), percorre a stream populando os buffers e, depois, trabalha com o array completo
    const buffers = [] 

    //quando eu uso o await para trabalhar com streams, ele aguarda cada pedaço da stream retornar para poder seguir
    for await (const chunk of req){
        buffers.push(chunk) // percorre cada pedaço da req (chunk of req) e add esse pedaço dentro do array de buffers
    }

    // após tudo ter sido finalizado:
    const fullStreamContent = Buffer.concat(buffers).toString()
    console.log(fullStreamContent)
    return res.end(fullStreamContent)

    /*return req // pegando uma stram de leitura
        .pipe(new InverseNumberStream()) // faznedo o encadeamento com a stream de transformação
        .pipe(res) // colocando os dados transformados na stream de escrita*/
})

server.listen(3334)
