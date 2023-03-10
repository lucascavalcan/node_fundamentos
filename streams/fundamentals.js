// conectar streams -> como está lendo dados aos poucos, esses dados que forem sendo lidos vão ser enviados para outra stream que vai tratá-los

// process - variável global do node
/*process.stdin // READABLE STREAM
    .pipe(process.stdout)*/ // retorno da aplicação - WRITABLE STREAM
// determinou-se que --> tudo que for recebido comoo entrada (stdin) vai ser encaminhado (pipe) para uma saída (stdout)


// STREAMS DE TRANSFORMAÇÃO (TRANSFORM) --> servem para transformar um dado/chunk em outro

// CONSTRUIR UMA STREAM DO ZERO
import {Readable, Writable, Transform} from 'node:stream'

// stream de leitura:
class OneToHundredStream extends Readable {
    // essa stream vai somar 1 até chegar em 100
    index = 1

    _read() { //método obrigatório das streams readable --> retorna quais os dados dessa stream
        const i = this.index++

        setTimeout(() => {
        // a cada 1 segundo vai executar esse código, ou seja, mesmo antes de chegar a 100, vai mostrar no terminal os números que já foram emitidos
            if (i > 100) { // se ja chegou em 100
                this.push(null)
            } else {
                const buf = Buffer.from(String(i)) // convertendo a const 'i' no formato buffer para que a stream possa ler esse dado (o buffer não aceita números - tem que transformar em string primeiro)
                this.push(buf)
            }
        }, 1000);
    }
}

/*new OneToHundredStream() 
    .pipe(process.stdout) */
// vai ler a stream OneToHundredStream e, enquanto está lendo, ja vai escrevendo no terminal (stdout)



// stream de escrita:
//stream de escrita vai receber dados de uma stream de leitura e vai fazer alguma coisa com esses dados
class MultiplyByTenStream extends Writable {
    // vai receber um numero e vai multiplicá-lo por 10
    _write(chunk, encoding, callback) { // recebe 3 parametros (chunk - parte da stream de leitura que ja foi lida) (encoding - como essa informação está codificada) (callback - função que a stream chama quando ela termina de fazer oq tinha de ser feito com aquela info)
        // na stream de escrita NÃO SE RETORNA NADA, ela apenas processa um dado (nunca transforma um dado em outra coisa)
        console.log(Number(chunk.toString()) * 10)
        callback()
    }
}

/*new OneToHundredStream() // está lendo dados de uma stream de leitura (que retorna numeros de 1 a 100)
    .pipe(new MultiplyByTenStream()) // em seguinda está colcoando esse resultado em uma stream de escrita (que multiplica numeros por 10)*/



//stream de transformação
class InverseNumberStream extends Transform {
    //stream que vai transformar todo numero em negativo
    _transform(chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1
        
        callback(null, Buffer.from(String(transformed))) // o 1º parametro do callback é o erro (null) é o sucesso (o numero transformado - transformed)
    }
}

new OneToHundredStream() // está lendo dados de uma stream de leitura (que retorna numeros de 1 a 100) - essa stream só consegue ler dados
.pipe(new InverseNumberStream()) // essa stream obrigatoriamnete precisa ler de algum lugar e escrever para outro (stream de intermeio - comunicação entre duas streams)  
.pipe(new MultiplyByTenStream()) // essa stream só consegue escrever dados