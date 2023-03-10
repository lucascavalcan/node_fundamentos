// REQUISIÇÃO FICTIA SIMULANDO O FRONTEND FAZENDO UMA REQUISIÇAÕ PESADA AO SERVIDOR
import {Readable} from 'node:stream'

class OneToHundredStream extends Readable {
    // essa stream vai somar 1 até chegar em 100
    index = 1

    _read() { //método obrigatório das streams readable --> retorna quais os dados dessa stream
        const i = this.index++

        setTimeout(() => {
        // a cada 1 segundo vai executar esse código, ou seja, mesmo antes de chegar a 100, vai mostrar no terminal os números que já foram emitidos
            if (i > 5) { // se ja chegou em 100
                this.push(null)
            } else {
                const buf = Buffer.from(String(i)) // convertendo a const 'i' no formato buffer para que a stream possa ler esse dado (o buffer não aceita números - tem que transformar em string primeiro)
                this.push(buf)
            }
        }, 1000);
    }
}

//vai ser feita uma requisição fetch ao locallhost:3334 (onde está o servidor)
fetch('http://localhost:3334', {
    method: 'POST',
    body: new OneToHundredStream(),
    duplex: 'half' // adicione essa linha
}).then(response => {
    response.text().then(data => {
        console.log(data)
    })
})