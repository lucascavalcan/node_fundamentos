// conectar streams -> como está lendo dados aos poucos, esses dados que forem sendo lidos vão ser enviados para outra stream que vai tratá-los

// process - variável global do node
/*process.stdin // READABLE STREAM
    .pipe(process.stdout)*/ // retorno da aplicação - WRITABLE STREAM
// determinou-se que --> tudo que for recebido comoo entrada (stdin) vai ser encaminhado (pipe) para uma saída (stdout)

// CONSTRUIR UMA STREAM DO ZERO
import {Readable} from 'node:stream'

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

new OneToHundredStream() 
    .pipe(process.stdout)
// vai ler a stream OneToHundredStream e, enquanto está lendo, ja vai escrevendo no terminal (stdout)